import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const getPredictionsForMatch = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("predictions")
      .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
      .collect();
  },
});

export const getTodaysPredictions = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysMatches = await ctx.db
      .query("matches")
      .withIndex("by_date", (q) => 
        q.gte("matchDate", today.getTime()).lt("matchDate", tomorrow.getTime())
      )
      .collect();
    
    const predictions = [];
    for (const match of todaysMatches) {
      const matchPredictions = await ctx.db
        .query("predictions")
        .withIndex("by_match", (q) => q.eq("matchId", match._id))
        .collect();
      
      predictions.push({
        match,
        predictions: matchPredictions,
      });
    }
    
    return predictions;
  },
});

export const getTopPredictions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const predictions = await ctx.db
      .query("predictions")
      .withIndex("by_confidence", (q) => q.gte("confidence", 70))
      .order("desc")
      .take(args.limit || 10);
    
    const enrichedPredictions = [];
    for (const prediction of predictions) {
      const match = await ctx.db.get(prediction.matchId);
      enrichedPredictions.push({
        ...prediction,
        match,
      });
    }
    
    return enrichedPredictions;
  },
});

export const generateAIPrediction = action({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args): Promise<{ success: boolean; predictions: any[] }> => {
    const match = await ctx.runQuery(api.matches.getMatchById, { matchId: args.matchId });
    if (!match) throw new Error("Match not found");
    
    const prompt = `Analyze: ${match.homeTeam} vs ${match.awayTeam} (${match.league})
Odds: H${match.odds.home} D${match.odds.draw} A${match.odds.away}

Provide 3 predictions as JSON:
1. Match result: Home/Draw/Away
2. Goals: "Over 1.5"/"Over 2.5"/"Over 3.5"/"Under 3.5"/"Under 4.5"
3. Both teams score: Yes/No

Format:
{"predictions":[{"type":"match_result","prediction":"Home","confidence":75,"reasoning":"Strong home form"},{"type":"over_under","prediction":"Over 2.5","confidence":68,"reasoning":"Both teams attacking"},{"type":"both_teams_score","prediction":"Yes","confidence":72,"reasoning":"Weak defenses"}]}`;
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      
      const content = response.choices[0].message.content;
      if (!content) throw new Error("No AI response");
      
      // Parse AI response and create predictions
      const aiAnalysis = JSON.parse(content);
      
      for (const pred of aiAnalysis.predictions) {
        const odds = pred.type === "match_result" 
          ? (pred.prediction === "Home" ? match.odds.home : 
             pred.prediction === "Draw" ? match.odds.draw : match.odds.away)
          : 2.0; // Default odds for other bet types
        
        await ctx.runMutation(api.predictions.createPrediction, {
          matchId: args.matchId,
          predictionType: pred.type,
          prediction: pred.prediction,
          confidence: pred.confidence,
          aiModel: "gpt-4.1-nano",
          reasoning: pred.reasoning,
          odds,
          potentialReturn: odds * 10, // Assuming GH₵10 stake
        });
      }
      
      return { success: true, predictions: aiAnalysis.predictions };
    } catch (error) {
      console.error("AI prediction error:", error);
      
      // Fallback predictions if AI fails
      const homeProb = 1 / match.odds.home;
      const drawProb = 1 / match.odds.draw;
      const awayProb = 1 / match.odds.away;
      const maxProb = Math.max(homeProb, drawProb, awayProb);
      
      let result = "Draw";
      if (maxProb === homeProb) result = "Home";
      else if (maxProb === awayProb) result = "Away";
      
      const fallbackPredictions: Array<{
        type: string;
        prediction: string;
        confidence: number;
        reasoning: string;
      }> = [
        {
          type: "match_result",
          prediction: result,
          confidence: Math.round(maxProb * 100),
          reasoning: "Based on odds analysis",
        },
        {
          type: "over_under",
          prediction: "Over 2.5",
          confidence: 65,
          reasoning: "Average goal expectation",
        },
        {
          type: "both_teams_score",
          prediction: "Yes",
          confidence: 60,
          reasoning: "Competitive matchup",
        }
      ];
      
      for (const pred of fallbackPredictions) {
        const odds = pred.type === "match_result" 
          ? (pred.prediction === "Home" ? match.odds.home : 
             pred.prediction === "Draw" ? match.odds.draw : match.odds.away)
          : 2.0;
        await ctx.runMutation(api.predictions.createPrediction, {
          matchId: args.matchId,
          predictionType: pred.type as any,
          prediction: pred.prediction,
          confidence: pred.confidence,
          aiModel: "fallback",
          reasoning: pred.reasoning,
          odds,
          potentialReturn: odds * 10,
        });
      }
      
      return { success: true, predictions: fallbackPredictions };
    }
  },
});

export const createPrediction = mutation({
  args: {
    matchId: v.id("matches"),
    predictionType: v.union(
      v.literal("match_result"), 
      v.literal("over_under"), 
      v.literal("both_teams_score")
    ),
    prediction: v.string(),
    confidence: v.number(),
    aiModel: v.string(),
    reasoning: v.string(),
    odds: v.number(),
    potentialReturn: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("predictions", {
      ...args,
      status: "pending",
    });
  },
});

export const updatePredictionResults = action({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const match = await ctx.runQuery(api.matches.getMatchById, { matchId: args.matchId });
    if (!match || match.status !== "finished") return;
    
    const predictions = await ctx.runQuery(api.predictions.getPredictionsForMatch, { matchId: args.matchId });
    
    for (const prediction of predictions) {
      let isCorrect = false;
      let actualResult = "";
      
      if (prediction.predictionType === "match_result") {
        if (match.homeScore! > match.awayScore!) {
          actualResult = "Home";
          isCorrect = prediction.prediction === "Home";
        } else if (match.homeScore! < match.awayScore!) {
          actualResult = "Away";
          isCorrect = prediction.prediction === "Away";
        } else {
          actualResult = "Draw";
          isCorrect = prediction.prediction === "Draw";
        }
      }
      
      await ctx.runMutation(api.predictions.updatePredictionStatus, {
        predictionId: prediction._id,
        status: isCorrect ? "won" : "lost",
        actualResult,
      });
    }
  },
});

export const updatePredictionStatus = mutation({
  args: {
    predictionId: v.id("predictions"),
    status: v.union(v.literal("won"), v.literal("lost")),
    actualResult: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.predictionId, {
      status: args.status,
      actualResult: args.actualResult,
    });
  },
});
