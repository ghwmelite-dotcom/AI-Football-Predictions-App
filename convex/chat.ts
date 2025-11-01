import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Send a message
export const sendMessage = mutation({
  args: {
    roomId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in to send messages");
    
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    
    // Don't allow guests to send messages
    if (user.isAnonymous) {
      throw new Error("Guest users cannot send messages. Please create an account.");
    }
    
    return await ctx.db.insert("messages", {
      roomId: args.roomId,
      userId,
      userName: user.name || user.email || "Anonymous",
      content: args.content,
    });
  },
});

// Get messages for a room
export const getMessages = query({
  args: { 
    roomId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(args.limit || 50);
    
    return messages.reverse();
  },
});

// Get available chat rooms
export const getRooms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chatRooms").collect();
  },
});

// Create a chat room (admin only)
export const createRoom = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    type: v.union(v.literal("general"), v.literal("match")),
    matchId: v.optional(v.id("matches")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    return await ctx.db.insert("chatRooms", {
      name: args.name,
      description: args.description,
      type: args.type,
      matchId: args.matchId,
      isActive: true,
    });
  },
});

// Delete a message (user can delete their own, admin can delete any)
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");
    
    // Check if user owns the message
    if (message.userId !== userId) {
      // Check if user is admin
      const roleDoc = await ctx.db
        .query("userRoles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();
      
      if (roleDoc?.role !== "admin") {
        throw new Error("You can only delete your own messages");
      }
    }
    
    await ctx.db.delete(args.messageId);
  },
});

// Update user presence in a room
export const updatePresence = mutation({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const user = await ctx.db.get(userId);
    if (!user) return null;
    
    const existing = await ctx.db
      .query("chatPresence")
      .withIndex("by_user_and_room", (q) => 
        q.eq("userId", userId).eq("roomId", args.roomId)
      )
      .first();
    
    const now = Date.now();
    
    if (existing) {
      await ctx.db.patch(existing._id, { lastSeen: now });
    } else {
      await ctx.db.insert("chatPresence", {
        userId,
        userName: user.name || user.email || "Anonymous",
        roomId: args.roomId,
        lastSeen: now,
      });
    }
    
    return null;
  },
});

// Get online users in a room (active in last 5 minutes)
export const getOnlineUsers = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    
    // Only fetch recent presence records
    const presenceRecords = await ctx.db
      .query("chatPresence")
      .withIndex("by_room_and_time", (q) => 
        q.eq("roomId", args.roomId).gt("lastSeen", fiveMinutesAgo)
      )
      .take(50); // Limit to prevent excessive reads
    
    // Deduplicate by userId
    const uniqueUsers = Array.from(
      new Map(presenceRecords.map(user => [user.userId, user])).values()
    );
    
    return uniqueUsers;
  },
});

// Cleanup old presence records (called by cron)
export const cleanupOldPresence = internalMutation({
  args: {},
  handler: async (ctx) => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    const oldRecords = await ctx.db
      .query("chatPresence")
      .filter((q) => q.lt(q.field("lastSeen"), oneHourAgo))
      .take(100);
    
    for (const record of oldRecords) {
      await ctx.db.delete(record._id);
    }
    
    return { deleted: oldRecords.length };
  },
});
