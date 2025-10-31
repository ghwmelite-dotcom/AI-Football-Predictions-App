import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";

export function AdminPanel() {
  const isAdmin = useQuery(api.admin.checkIsAdmin);
  const allUsers = useQuery(api.admin.getAllUsers, isAdmin ? {} : "skip");
  const makeUserAdmin = useMutation(api.admin.makeUserAdmin);
  const fetchLiveMatches = useAction(api.admin.fetchLiveMatches);
  const fetchLiveUpdates = useAction(api.liveMatches.fetchLiveMatchUpdates);
  const deleteMatch = useMutation(api.admin.deleteMatch);
  const upcomingMatches = useQuery(api.matches.getUpcomingMatches, isAdmin ? { limit: 20 } : "skip");
  
  const [loading, setLoading] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState("");

  if (isAdmin === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
      >
        <span className="text-4xl mb-4 block">🔒</span>
        <h3 className="text-xl font-semibold text-red-800 mb-2">Admin Access Required</h3>
        <p className="text-red-600">You don't have permission to access this panel.</p>
      </motion.div>
    );
  }

  const handleFetchMatches = async () => {
    setLoading(true);
    try {
      const result = await fetchLiveMatches({ league: selectedLeague || undefined });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchLiveUpdates = async () => {
    setLiveLoading(true);
    try {
      const result = await fetchLiveUpdates();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch live updates");
    } finally {
      setLiveLoading(false);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    try {
      await deleteMatch({ matchId: matchId as any });
      toast.success("Match deleted successfully");
    } catch (error) {
      toast.error("Failed to delete match");
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      await makeUserAdmin({ userId: userId as any });
      toast.success("User promoted to admin");
    } catch (error) {
      toast.error("Failed to promote user");
    }
  };

  const leagues = [
    { id: "39", name: "Premier League" },
    { id: "140", name: "La Liga" },
    { id: "78", name: "Bundesliga" },
    { id: "135", name: "Serie A" },
    { id: "61", name: "Ligue 1" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center space-x-3">
          <span className="text-3xl">👑</span>
          <div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-purple-100">Manage matches, users, and system settings</p>
          </div>
        </div>
      </motion.div>

      {/* Fetch Matches Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🌍 Fetch Live Matches</h3>
        <p className="text-gray-600 text-sm mb-4">
          Import real matches from API-Football. Configure API_FOOTBALL_KEY in environment variables.
        </p>
        
        <div className="flex gap-4 mb-4">
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Leagues</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFetchMatches}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Fetching..." : "Fetch Matches"}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFetchLiveUpdates}
            disabled={liveLoading}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {liveLoading ? "Updating..." : "Update Live"}
          </motion.button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You need to set up API_FOOTBALL_KEY in your environment variables.
            Get your free API key from <a href="https://www.api-football.com/" target="_blank" rel="noopener noreferrer" className="underline">api-football.com</a>
          </p>
        </div>
      </motion.div>

      {/* Manage Matches */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">⚽ Manage Matches</h3>
        
        {!upcomingMatches ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : upcomingMatches.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No matches to manage</p>
        ) : (
          <div className="space-y-3">
            {upcomingMatches.map((match, index) => (
              <motion.div
                key={match._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {match.homeTeam} vs {match.awayTeam}
                  </p>
                  <p className="text-sm text-gray-500">{match.league}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteMatch(match._id)}
                  className="text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  🗑️ Delete
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* User Management */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">👥 User Management</h3>
        
        {!allUsers ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {allUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{user.email || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">
                    Role: <span className={user.role === "admin" ? "text-purple-600 font-semibold" : "text-gray-600"}>
                      {user.role}
                    </span>
                  </p>
                </div>
                {user.role !== "admin" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMakeAdmin(user._id)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Make Admin
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
