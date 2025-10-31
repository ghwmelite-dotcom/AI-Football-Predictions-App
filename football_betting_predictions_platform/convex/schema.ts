import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userRoles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user")),
  })
    .index("by_user", ["userId"]),

  matches: defineTable({
    homeTeam: v.string(),
    awayTeam: v.string(),
    league: v.string(),
    matchDate: v.number(),
    status: v.union(v.literal("upcoming"), v.literal("live"), v.literal("finished")),
    homeScore: v.optional(v.number()),
    awayScore: v.optional(v.number()),
    odds: v.object({
      home: v.number(),
      draw: v.number(),
      away: v.number(),
    }),
    externalId: v.optional(v.string()),
    venue: v.optional(v.string()),
    homeTeamLogo: v.optional(v.string()),
    awayTeamLogo: v.optional(v.string()),
    minute: v.optional(v.number()),
    halfTime: v.optional(v.boolean()),
    extraTime: v.optional(v.boolean()),
    penalties: v.optional(v.boolean()),
    lastUpdated: v.optional(v.number()),
  })
    .index("by_date", ["matchDate"])
    .index("by_league", ["league"])
    .index("by_status", ["status"]),

  predictions: defineTable({
    matchId: v.id("matches"),
    predictionType: v.union(
      v.literal("match_result"), 
      v.literal("over_under"), 
      v.literal("both_teams_score")
    ),
    prediction: v.string(),
    confidence: v.number(), // 0-100
    aiModel: v.string(),
    reasoning: v.string(),
    odds: v.number(),
    potentialReturn: v.number(),
    status: v.union(v.literal("pending"), v.literal("won"), v.literal("lost")),
    actualResult: v.optional(v.string()),
  })
    .index("by_match", ["matchId"])
    .index("by_confidence", ["confidence"])
    .index("by_status", ["status"]),

  userPredictions: defineTable({
    userId: v.id("users"),
    matchId: v.id("matches"),
    prediction: v.string(),
    confidence: v.number(),
    reasoning: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("won"), v.literal("lost")),
  })
    .index("by_user", ["userId"])
    .index("by_match", ["matchId"]),

  analytics: defineTable({
    date: v.string(), // YYYY-MM-DD format
    totalPredictions: v.number(),
    correctPredictions: v.number(),
    accuracy: v.number(),
    totalROI: v.number(),
    avgConfidence: v.number(),
    predictionType: v.string(),
  })
    .index("by_date", ["date"])
    .index("by_type", ["predictionType"]),

  leagues: defineTable({
    name: v.string(),
    country: v.string(),
    season: v.string(),
    isActive: v.boolean(),
  })
    .index("by_country", ["country"])
    .index("by_active", ["isActive"]),

  userStats: defineTable({
    userId: v.id("users"),
    totalPredictions: v.number(),
    correctPredictions: v.number(),
    accuracy: v.number(),
    streak: v.number(),
    bestStreak: v.number(),
    totalROI: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_accuracy", ["accuracy"]),

  bookingCodes: defineTable({
    code: v.string(),
    platform: v.string(),
    matches: v.array(v.id("matches")),
    description: v.string(),
    odds: v.number(),
    stake: v.number(),
    potentialWin: v.number(),
    expiresAt: v.number(),
    status: v.union(v.literal("active"), v.literal("won"), v.literal("lost"), v.literal("expired")),
    createdBy: v.id("users"),
  })
    .index("by_status", ["status"])
    .index("by_expiry", ["expiresAt"]),

  chatRooms: defineTable({
    name: v.string(),
    description: v.string(),
    type: v.union(v.literal("general"), v.literal("match")),
    matchId: v.optional(v.id("matches")),
    isActive: v.boolean(),
  })
    .index("by_type", ["type"]),

  messages: defineTable({
    roomId: v.string(),
    userId: v.id("users"),
    userName: v.string(),
    content: v.string(),
    reactions: v.optional(v.array(v.object({
      emoji: v.string(),
      userId: v.id("users"),
      userName: v.string(),
    }))),
  })
    .index("by_room", ["roomId"]),

  chatPresence: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    roomId: v.string(),
    lastSeen: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user_and_room", ["userId", "roomId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
