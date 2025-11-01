import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function PredictionsCard() {
  const todaysPredictions = useQuery(api.predictions.getTodaysPredictions);
  const topPredictions = useQuery(api.predictions.getTopPredictions, { limit: 5 });
  const generatePrediction = useAction(api.predictions.generateAIPrediction);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isAdmin = loggedInUser?.role === "admin";

  const handleGeneratePrediction = async (matchId: string) => {
    const toastId = toast.loading("Generating AI prediction...");
    try {
      await generatePrediction({ matchId: matchId as any });
      toast.success("AI prediction generated!", { id: toastId });
    } catch (error) {
      toast.error("Failed to generate prediction", { id: toastId });
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50";
    if (confidence >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case "match_result": return "🏆";
      case "over_under": return "⚽";
      case "both_teams_score": return "🥅";
      default: return "🎯";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Today's AI Predictions</h2>
        <p className="text-gray-600 text-sm mt-1">AI-powered predictions with confidence levels</p>
      </div>
      
      <div className="p-6">
        {!todaysPredictions ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : todaysPredictions.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">🤖</span>
            <p className="text-gray-500 mb-4">No predictions available for today</p>
            <p className="text-sm text-gray-400">Create some matches to see AI predictions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysPredictions.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {item.match.homeTeam} vs {item.match.awayTeam}
                    </h3>
                    <p className="text-sm text-gray-500">{item.match.league}</p>
                  </div>
                  {item.predictions.length === 0 && isAdmin && (
                    <button
                      onClick={() => handleGeneratePrediction(item.match._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Generate AI Prediction
                    </button>
                  )}
                </div>
                
                {item.predictions.length > 0 ? (
                  <div className="space-y-2">
                    {item.predictions.map((prediction, predIndex) => (
                      <div key={predIndex} className="flex items-center justify-between bg-gray-50 rounded p-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getPredictionIcon(prediction.predictionType)}</span>
                          <div>
                            <p className="font-medium text-gray-800">{prediction.prediction}</p>
                            <p className="text-xs text-gray-500">{prediction.reasoning}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(prediction.confidence)}`}>
                            {prediction.confidence}% confidence
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Odds: {prediction.odds}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No predictions generated yet</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
