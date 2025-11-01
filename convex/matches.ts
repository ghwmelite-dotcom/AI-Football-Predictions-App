import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get upcoming matches (sorted by earliest kickoff first)
export const getUpcomingMatches = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .order("asc")
      .take(args.limit || 20);
    
    // Sort by matchDate to ensure earliest kickoff is first
    return matches.sort((a, b) => a.matchDate - b.matchDate);
  },
});

// Get live matches
export const getLiveMatches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "live"))
      .order("desc")
      .take(10);
  },
});

// Get finished matches
export const getFinishedMatches = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "finished"))
      .order("desc")
      .take(args.limit || 20);
  },
});

// Get match by ID
export const getMatchById = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.matchId);
  },
});

// Get all matches (for admin)
export const getAllMatches = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const roleDoc = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (roleDoc?.role !== "admin") {
      throw new Error("Admin access required");
    }
    
    const matches = await ctx.db.query("matches").order("desc").take(100);
    return matches.sort((a, b) => b.matchDate - a.matchDate);
  },
});

// Create a new match (admin only)
export const createMatch = mutation({
  args: {
    homeTeam: v.string(),
    awayTeam: v.string(),
    league: v.string(),
    matchDate: v.number(),
    venue: v.optional(v.string()),
    homeTeamLogo: v.optional(v.string()),
    awayTeamLogo: v.optional(v.string()),
    homeOdds: v.number(),
    drawOdds: v.number(),
    awayOdds: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const roleDoc = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (roleDoc?.role !== "admin") {
      throw new Error("Admin access required");
    }
    
    return await ctx.db.insert("matches", {
      homeTeam: args.homeTeam,
      awayTeam: args.awayTeam,
      league: args.league,
      matchDate: args.matchDate,
      status: "upcoming",
      venue: args.venue,
      homeTeamLogo: args.homeTeamLogo,
      awayTeamLogo: args.awayTeamLogo,
      odds: {
        home: args.homeOdds,
        draw: args.drawOdds,
        away: args.awayOdds,
      },
      lastUpdated: Date.now(),
    });
  },
});

// Update match (admin only)
export const updateMatch = mutation({
  args: {
    matchId: v.id("matches"),
    homeTeam: v.optional(v.string()),
    awayTeam: v.optional(v.string()),
    league: v.optional(v.string()),
    matchDate: v.optional(v.number()),
    status: v.optional(v.union(v.literal("upcoming"), v.literal("live"), v.literal("finished"))),
    homeScore: v.optional(v.number()),
    awayScore: v.optional(v.number()),
    venue: v.optional(v.string()),
    homeTeamLogo: v.optional(v.string()),
    awayTeamLogo: v.optional(v.string()),
    homeOdds: v.optional(v.number()),
    drawOdds: v.optional(v.number()),
    awayOdds: v.optional(v.number()),
    minute: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const roleDoc = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (roleDoc?.role !== "admin") {
      throw new Error("Admin access required");
    }
    
    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error("Match not found");
    
    const updates: any = { lastUpdated: Date.now() };
    
    if (args.homeTeam !== undefined) updates.homeTeam = args.homeTeam;
    if (args.awayTeam !== undefined) updates.awayTeam = args.awayTeam;
    if (args.league !== undefined) updates.league = args.league;
    if (args.matchDate !== undefined) updates.matchDate = args.matchDate;
    if (args.status !== undefined) updates.status = args.status;
    if (args.homeScore !== undefined) updates.homeScore = args.homeScore;
    if (args.awayScore !== undefined) updates.awayScore = args.awayScore;
    if (args.venue !== undefined) updates.venue = args.venue;
    if (args.homeTeamLogo !== undefined) updates.homeTeamLogo = args.homeTeamLogo;
    if (args.awayTeamLogo !== undefined) updates.awayTeamLogo = args.awayTeamLogo;
    if (args.minute !== undefined) updates.minute = args.minute;
    
    if (args.homeOdds !== undefined || args.drawOdds !== undefined || args.awayOdds !== undefined) {
      updates.odds = {
        home: args.homeOdds ?? match.odds.home,
        draw: args.drawOdds ?? match.odds.draw,
        away: args.awayOdds ?? match.odds.away,
      };
    }
    
    await ctx.db.patch(args.matchId, updates);
    return args.matchId;
  },
});

// Delete match (admin only)
export const deleteMatch = mutation({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const roleDoc = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (roleDoc?.role !== "admin") {
      throw new Error("Admin access required");
    }
    
    await ctx.db.delete(args.matchId);
    return null;
  },
});

// Get available leagues
export const getLeagues = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("leagues")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Create league (admin only)
export const createLeague = mutation({
  args: {
    name: v.string(),
    country: v.string(),
    season: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const roleDoc = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (roleDoc?.role !== "admin") {
      throw new Error("Admin access required");
    }
    
    return await ctx.db.insert("leagues", {
      name: args.name,
      country: args.country,
      season: args.season,
      isActive: true,
    });
  },
});
