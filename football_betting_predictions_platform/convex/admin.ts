import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

// Check if user is admin
async function isAdmin(ctx: any): Promise<boolean> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;
  
  const roleDoc = await ctx.db
    .query("userRoles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();
  
  return roleDoc?.role === "admin";
}

// Make user admin (for initial setup)
export const makeUserAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, { role: "admin" });
    } else {
      await ctx.db.insert("userRoles", {
        userId: args.userId,
        role: "admin",
      });
    }
  },
});

// Check if current user is admin
export const checkIsAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await isAdmin(ctx);
  },
});

// Fetch matches from API-Football
export const fetchLiveMatches = action({
  args: { 
    league: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.API_FOOTBALL_KEY;
    
    if (!apiKey) {
      throw new Error("API_FOOTBALL_KEY not configured");
    }
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const url = `https://v3.football.api-sports.io/fixtures?date=${today}${args.league ? `&league=${args.league}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.response || data.response.length === 0) {
        return { success: false, message: "No matches found" };
      }
      
      let imported = 0;
      for (const fixture of data.response.slice(0, 20)) {
        const matchDate = new Date(fixture.fixture.date).getTime();
        
        const existing = await ctx.runQuery(api.admin.checkMatchExists, {
          externalId: fixture.fixture.id.toString(),
        });
        
        if (!existing) {
          await ctx.runMutation(api.matches.createMatch, {
            homeTeam: fixture.teams.home.name,
            awayTeam: fixture.teams.away.name,
            league: fixture.league.name,
            matchDate,
            odds: { home: 2.0, draw: 3.0, away: 2.5 },
          });
          imported++;
        }
      }
      
      return { 
        success: true, 
        message: `Imported ${imported} matches`,
        total: data.response.length 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || "Failed to fetch matches" 
      };
    }
  },
});

export const checkMatchExists = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    const match = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("externalId"), args.externalId))
      .first();
    return match !== null;
  },
});

// Admin: Delete match
export const deleteMatch = mutation({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const admin = await isAdmin(ctx);
    if (!admin) throw new Error("Admin access required");
    
    await ctx.db.delete(args.matchId);
  },
});

// Admin: Get all users
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const admin = await isAdmin(ctx);
    if (!admin) throw new Error("Admin access required");
    
    const users = await ctx.db.query("users").collect();
    const usersWithRoles = [];
    
    for (const user of users) {
      const roleDoc = await ctx.db
        .query("userRoles")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();
      
      usersWithRoles.push({
        ...user,
        role: roleDoc?.role || "user",
      });
    }
    
    return usersWithRoles;
  },
});

export const getActiveBookingCodes = query({
  args: {},
  handler: async (ctx) => {
    const admin = await isAdmin(ctx);
    if (!admin) throw new Error("Admin access required");
    return await ctx.db.query("bookingCodes").withIndex("by_status", (q) => q.eq("status", "active")).collect();
  },
});
