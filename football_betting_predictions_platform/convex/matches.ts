import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUpcomingMatches = query({
  args: { 
    limit: v.optional(v.number()),
    league: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let query = ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .filter((q) => q.gte(q.field("matchDate"), now));
    
    if (args.league) {
      query = ctx.db
        .query("matches")
        .withIndex("by_league", (q) => q.eq("league", args.league!))
        .filter((q) => q.eq(q.field("status"), "upcoming"))
        .filter((q) => q.gte(q.field("matchDate"), now));
    }
    
    const matches = await query
      .order("asc")
      .take(args.limit || 20);
    
    return matches;
  },
});

export const getTodaysMatches = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await ctx.db
      .query("matches")
      .withIndex("by_date", (q) => 
        q.gte("matchDate", today.getTime()).lt("matchDate", tomorrow.getTime())
      )
      .collect();
  },
});

export const getMatchById = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.matchId);
  },
});

export const createMatch = mutation({
  args: {
    homeTeam: v.string(),
    awayTeam: v.string(),
    league: v.string(),
    matchDate: v.number(),
    odds: v.object({
      home: v.number(),
      draw: v.number(),
      away: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("matches", {
      ...args,
      status: "upcoming",
    });
  },
});

export const updateMatchResult = mutation({
  args: {
    matchId: v.id("matches"),
    homeScore: v.number(),
    awayScore: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.matchId, {
      homeScore: args.homeScore,
      awayScore: args.awayScore,
      status: "finished",
    });
    
    // Trigger prediction result updates
    await ctx.scheduler.runAfter(0, api.predictions.updatePredictionResults, {
      matchId: args.matchId,
    });
  },
});

// Sample data creation for demo
export const createSampleMatches = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleMatches = [
      {
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        league: "Premier League",
        matchDate: Date.now() + 24 * 60 * 60 * 1000, // Tomorrow
        odds: { home: 2.5, draw: 3.2, away: 2.8 },
      },
      {
        homeTeam: "Barcelona",
        awayTeam: "Real Madrid",
        league: "La Liga",
        matchDate: Date.now() + 2 * 24 * 60 * 60 * 1000, // Day after tomorrow
        odds: { home: 2.1, draw: 3.5, away: 3.0 },
      },
      {
        homeTeam: "Bayern Munich",
        awayTeam: "Borussia Dortmund",
        league: "Bundesliga",
        matchDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
        odds: { home: 1.8, draw: 3.8, away: 4.2 },
      },
    ];
    
    for (const match of sampleMatches) {
      await ctx.db.insert("matches", {
        ...match,
        status: "upcoming",
      });
    }
  },
});
