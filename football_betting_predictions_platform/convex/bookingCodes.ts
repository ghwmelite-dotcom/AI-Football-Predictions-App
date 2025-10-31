import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new booking code
export const createBookingCode = mutation({
  args: {
    code: v.string(),
    platform: v.string(),
    matches: v.array(v.id("matches")),
    description: v.string(),
    odds: v.number(),
    stake: v.number(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const potentialWin = args.stake * args.odds;
    
    return await ctx.db.insert("bookingCodes", {
      ...args,
      potentialWin,
      status: "active",
      createdBy: userId,
    });
  },
});

// Get active booking codes
export const getActiveBookingCodes = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const codes = await ctx.db
      .query("bookingCodes")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .order("desc")
      .take(args.limit || 10);
    
    // Enrich with match details
    const enrichedCodes = [];
    for (const code of codes) {
      const matches = [];
      for (const matchId of code.matches) {
        const match = await ctx.db.get(matchId);
        if (match) matches.push(match);
      }
      enrichedCodes.push({ ...code, matchDetails: matches });
    }
    
    return enrichedCodes;
  },
});

// Get booking code by ID
export const getBookingCodeById = query({
  args: { codeId: v.id("bookingCodes") },
  handler: async (ctx, args) => {
    const code = await ctx.db.get(args.codeId);
    if (!code) return null;
    
    const matches = [];
    for (const matchId of code.matches) {
      const match = await ctx.db.get(matchId);
      if (match) matches.push(match);
    }
    
    return { ...code, matchDetails: matches };
  },
});

// Update booking code status
export const updateBookingCodeStatus = mutation({
  args: {
    codeId: v.id("bookingCodes"),
    status: v.union(v.literal("won"), v.literal("lost"), v.literal("expired")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    await ctx.db.patch(args.codeId, {
      status: args.status,
    });
  },
});

// Get user's booking codes
export const getUserBookingCodes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    const codes = await ctx.db
      .query("bookingCodes")
      .filter((q) => q.eq(q.field("createdBy"), userId))
      .order("desc")
      .take(20);
    
    const enrichedCodes = [];
    for (const code of codes) {
      const matches = [];
      for (const matchId of code.matches) {
        const match = await ctx.db.get(matchId);
        if (match) matches.push(match);
      }
      enrichedCodes.push({ ...code, matchDetails: matches });
    }
    
    return enrichedCodes;
  },
});
