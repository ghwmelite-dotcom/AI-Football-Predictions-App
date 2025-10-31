import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";

export function LiveMatchCard() {
  const liveMatches = useQuery(api.liveMatches.getLiveMatches);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isGuest = loggedInUser?.isAnonymous === true;
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  if (!liveMatches || liveMatches.length === 0) {
    return null;
  }

  const getMatchTime = (match: any) => {
    if (match.minute) {
      if (match.halfTime) return "HT";
      if (match.extraTime) return `${match.minute}' ET`;
      if (match.penalties) return "Penalties";
      return `${match.minute}'`;
    }
    return "LIVE";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border"
    >
      <div className="p-6 border-b bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
            <h2 className="text-xl font-semibold text-gray-800">Live Matches</h2>
          </div>
          <span className="text-sm text-gray-600">{liveMatches.length} live</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {liveMatches.map((match, index) => (
          <motion.div
            key={match._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors relative"
          >
            {(match as any).isRestricted && isGuest ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/90 to-gray-200/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                  <div className="text-center p-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl mb-3"
                    >
                      🔒
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Live Updates Locked
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Create an account to view live match updates
                    </p>
                    <button
                      onClick={() => setShowSignUpPrompt(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold"
                    >
                      Sign Up Free
                    </button>
                  </div>
                </div>
                <div className="filter blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{match.league}</span>
                    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{match.homeTeam}</p>
                      <p className="font-medium text-gray-800 mt-1">{match.awayTeam}</p>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-2xl font-bold text-gray-400">?</p>
                      <p className="text-2xl font-bold text-gray-400">?</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{match.league}</span>
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded animate-pulse">
                    {getMatchTime(match)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{match.homeTeam}</p>
                    <p className="font-medium text-gray-800 mt-1">{match.awayTeam}</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-2xl font-bold text-gray-900">{match.homeScore ?? 0}</p>
                    <p className="text-2xl font-bold text-gray-900">{match.awayScore ?? 0}</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {showSignUpPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSignUpPrompt(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Unlock Live Match Updates
            </h3>
            <p className="text-gray-600 mb-6">
              Create a free account to access real-time match updates, scores, and live statistics for all matches.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold"
              >
                Create Free Account
              </button>
              <button
                onClick={() => setShowSignUpPrompt(false)}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
