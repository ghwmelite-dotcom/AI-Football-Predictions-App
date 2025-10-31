import { query, mutation, action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get live matches with guest user restrictions
export const getLiveMatches = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const user = userId ? await ctx.db.get(userId) : null;
    const isGuest = user?.isAnonymous === true;
    
    const liveMatches = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "live"))
      .collect();
    
    // Hide live data for guest users
    if (isGuest) {
      return liveMatches.map(match => ({
        ...match,
        homeScore: undefined,
        awayScore: undefined,
        minute: undefined,
        halfTime: undefined,
        extraTime: undefined,
        penalties: undefined,
        isRestricted: true,
      }));
    }
    
    return liveMatches;
  },
});

// Get match with live data (restricted for guests)
export const getMatchWithLiveData = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const user = userId ? await ctx.db.get(userId) : null;
    const isGuest = user?.isAnonymous === true;
    
    const match = await ctx.db.get(args.matchId);
    if (!match) return null;
    
    // Hide live data for guest users
    if (isGuest && match.status === "live") {
      return {
        ...match,
        homeScore: undefined,
        awayScore: undefined,
        minute: undefined,
        halfTime: undefined,
        extraTime: undefined,
        penalties: undefined,
        isRestricted: true,
      };
    }
    
    return match;
  },
});

// Update live match data (admin only)
export const updateLiveMatchData = mutation({
  args: {
    matchId: v.id("matches"),
    homeScore: v.number(),
    awayScore: v.number(),
    minute: v.optional(v.number()),
    halfTime: v.optional(v.boolean()),
    extraTime: v.optional(v.boolean()),
    penalties: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { matchId, ...updateData } = args;
    
    await ctx.db.patch(matchId, {
      ...updateData,
      status: "live",
      lastUpdated: Date.now(),
    });
  },
});

// Fetch live match updates from API (admin only)
export const fetchLiveMatchUpdates = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.API_FOOTBALL_KEY;
    
    if (!apiKey) {
      return { success: false, message: "API_FOOTBALL_KEY not configured" };
    }
    
    try {
      // Get all live matches from database
      const liveMatches = await ctx.runQuery(internal.liveMatches.getInternalLiveMatches);
      
      if (liveMatches.length === 0) {
        return { success: true, message: "No live matches to update" };
      }
      
      let updated = 0;
      for (const match of liveMatches) {
        if (!match.externalId) continue;
        
        const url = `https://v3.football.api-sports.io/fixtures?id=${match.externalId}`;
        
        const response = await fetch(url, {
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          }
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        
        if (data.response && data.response.length > 0) {
          const fixture = data.response[0];
          
          await ctx.runMutation(internal.liveMatches.updateInternalLiveMatch, {
            matchId: match._id,
            homeScore: fixture.goals.home || 0,
            awayScore: fixture.goals.away || 0,
            minute: fixture.fixture.status.elapsed,
            status: fixture.fixture.status.short === "FT" ? "finished" : "live",
          });
          
          updated++;
        }
      }
      
      return { success: true, message: `Updated ${updated} live matches` };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to fetch live updates" };
    }
  },
});

// Internal query to get live matches (no restrictions)
export const getInternalLiveMatches = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "live"))
      .collect();
  },
});

// Internal mutation to update live match
export const updateInternalLiveMatch = internalMutation({
  args: {
    matchId: v.id("matches"),
    homeScore: v.number(),
    awayScore: v.number(),
    minute: v.optional(v.number()),
    status: v.union(v.literal("live"), v.literal("finished")),
  },
  handler: async (ctx, args) => {
    const { matchId, ...updateData } = args;
    
    await ctx.db.patch(matchId, {
      ...updateData,
      lastUpdated: Date.now(),
    });
  },
});
