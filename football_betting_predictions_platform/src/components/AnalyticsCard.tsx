import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function AnalyticsCard() {
  const weeklyPerformance = useQuery(api.analytics.getWeeklyPerformance);
  const confidenceAnalysis = useQuery(api.analytics.getConfidenceAnalysis);
  const leaguePerformance = useQuery(api.analytics.getLeaguePerformance);

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Performance Analytics</h2>
        <p className="text-gray-600 text-sm mt-1">Detailed insights and trends</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Weekly Performance */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">📈 Weekly Performance</h3>
          {!weeklyPerformance ? (
            <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {weeklyPerformance.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <div className={`h-16 rounded flex items-end justify-center ${
                    day.accuracy > 70 ? 'bg-green-100' : 
                    day.accuracy > 50 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <div 
                      className={`w-full rounded-b ${
                        day.accuracy > 70 ? 'bg-green-500' : 
                        day.accuracy > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${Math.max(day.accuracy, 5)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium mt-1">{day.accuracy}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confidence Analysis */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">🎯 Confidence vs Accuracy</h3>
          {!confidenceAnalysis ? (
            <div className="animate-pulse space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {confidenceAnalysis.map((range, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{range.range}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{range.correct}/{range.total}</span>
                    <span className={`text-sm font-medium ${
                      range.accuracy > 70 ? 'text-green-600' : 
                      range.accuracy > 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {range.accuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* League Performance */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">🏆 League Performance</h3>
          {!leaguePerformance ? (
            <div className="animate-pulse space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : leaguePerformance.length === 0 ? (
            <p className="text-gray-500 text-sm">No league data available yet</p>
          ) : (
            <div className="space-y-2">
              {leaguePerformance.slice(0, 5).map((league, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{league.league}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{league.correct}/{league.total}</span>
                    <span className={`text-sm font-medium ${
                      league.accuracy > 70 ? 'text-green-600' : 
                      league.accuracy > 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {league.accuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
