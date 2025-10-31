import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";

export function MatchesCard() {
  const upcomingMatches = useQuery(api.matches.getUpcomingMatches, { limit: 5 });
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border"
    >
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-800">⚽ Upcoming Matches</h3>
        <p className="text-sm text-gray-500 mt-1">Next fixtures with kickoff times</p>
      </div>

      <div className="p-6">
        {!upcomingMatches ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : upcomingMatches.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No upcoming matches</p>
        ) : (
          <div className="space-y-3">
            {upcomingMatches.map((match, index) => (
              <motion.div
                key={match._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{match.league}</span>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {formatDate(match.matchDate)}
                  </span>
                </div>
                <p className="font-medium text-gray-800 text-sm">
                  {match.homeTeam} vs {match.awayTeam}
                </p>
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  <span>Odds:</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded">H: {match.odds.home}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded">D: {match.odds.draw}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded">A: {match.odds.away}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
