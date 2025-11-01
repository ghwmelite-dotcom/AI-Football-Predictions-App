import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOverallStats = query({
  args: {},
  handler: async (ctx) => {
    const predictions = await ctx.db.query("predictions").collect();
    const finishedPredictions = predictions.filter(p => p.status !== "pending");
    
    const totalPredictions = finishedPredictions.length;
    const correctPredictions = finishedPredictions.filter(p => p.status === "won").length;
    const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
    
    // Calculate ROI
    let totalStake = 0;
    let totalReturn = 0;
    
    finishedPredictions.forEach(p => {
      totalStake += 10; // Assuming $10 per bet
      if (p.status === "won") {
        totalReturn += p.potentialReturn;
      }
    });
    
    const roi = totalStake > 0 ? ((totalReturn - totalStake) / totalStake) * 100 : 0;
    
    // Get confidence distribution
    const highConfidence = predictions.filter(p => p.confidence >= 80).length;
    const mediumConfidence = predictions.filter(p => p.confidence >= 60 && p.confidence < 80).length;
    const lowConfidence = predictions.filter(p => p.confidence < 60).length;
    
    return {
      totalPredictions,
      correctPredictions,
      accuracy: Math.round(accuracy * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      confidenceDistribution: {
        high: highConfidence,
        medium: mediumConfidence,
        low: lowConfidence,
      },
      totalStake,
      totalReturn: Math.round(totalReturn * 100) / 100,
    };
  },
});

export const getWeeklyPerformance = query({
  args: {},
  handler: async (ctx) => {
    const predictions = await ctx.db.query("predictions").collect();
    const weeklyData = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayPredictions = predictions.filter(p => {
        const predDate = new Date(p._creationTime);
        return predDate >= date && predDate < nextDay;
      });
      
      const finishedPredictions = dayPredictions.filter(p => p.status !== "pending");
      const correctPredictions = finishedPredictions.filter(p => p.status === "won").length;
      const accuracy = finishedPredictions.length > 0 
        ? (correctPredictions / finishedPredictions.length) * 100 
        : 0;
      
      weeklyData.push({
        date: date.toISOString().split('T')[0],
        total: dayPredictions.length,
        correct: correctPredictions,
        accuracy: Math.round(accuracy * 100) / 100,
      });
    }
    
    return weeklyData;
  },
});

export const getLeaguePerformance = query({
  args: {},
  handler: async (ctx) => {
    const predictions = await ctx.db.query("predictions").collect();
    const matches = await ctx.db.query("matches").collect();
    
    const leagueStats = new Map();
    
    for (const prediction of predictions) {
      const match = matches.find(m => m._id === prediction.matchId);
      if (!match) continue;
      
      const league = match.league;
      if (!leagueStats.has(league)) {
        leagueStats.set(league, {
          league,
          total: 0,
          correct: 0,
          accuracy: 0,
        });
      }
      
      const stats = leagueStats.get(league);
      if (prediction.status !== "pending") {
        stats.total++;
        if (prediction.status === "won") {
          stats.correct++;
        }
      }
    }
    
    // Calculate accuracy for each league
    const result = Array.from(leagueStats.values()).map(stats => ({
      ...stats,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 10000) / 100 : 0,
    }));
    
    return result.sort((a, b) => b.accuracy - a.accuracy);
  },
});

export const getConfidenceAnalysis = query({
  args: {},
  handler: async (ctx) => {
    const predictions = await ctx.db.query("predictions").collect();
    const finishedPredictions = predictions.filter(p => p.status !== "pending");
    
    const confidenceRanges = [
      { min: 90, max: 100, label: "90-100%" },
      { min: 80, max: 89, label: "80-89%" },
      { min: 70, max: 79, label: "70-79%" },
      { min: 60, max: 69, label: "60-69%" },
      { min: 0, max: 59, label: "0-59%" },
    ];
    
    return confidenceRanges.map(range => {
      const rangePredictions = finishedPredictions.filter(
        p => p.confidence >= range.min && p.confidence <= range.max
      );
      
      const correct = rangePredictions.filter(p => p.status === "won").length;
      const total = rangePredictions.length;
      const accuracy = total > 0 ? (correct / total) * 100 : 0;
      
      return {
        range: range.label,
        total,
        correct,
        accuracy: Math.round(accuracy * 100) / 100,
      };
    });
  },
});
