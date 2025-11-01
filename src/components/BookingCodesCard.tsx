import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { SignUpPromptModal } from "./SignUpPromptModal";

export function BookingCodesCard() {
  const activeBookingCodes = useQuery(api.bookingCodes.getActiveBookingCodes, { limit: 5 });
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isAdmin = loggedInUser?.role === "admin";
  const isGuest = loggedInUser?.isAnonymous === true;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "won": return "bg-green-100 text-green-800";
      case "lost": return "bg-red-100 text-red-800";
      case "expired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours}h remaining`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Booking code copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border"
    >
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">🎫 Booking Codes</h3>
            <p className="text-sm text-gray-500 mt-1">Active betting slips</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Create
            </button>
          )}
        </div>
      </div>

      <div className="p-6 relative">
        {isGuest && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100/95 to-gray-200/95 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="text-center p-6">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl mb-3">🔒</motion.div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Codes Locked</h3>
              <p className="text-sm text-gray-600 mb-4">Create an account to view booking codes</p>
              <button onClick={() => setShowSignUpPrompt(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold">Sign Up Free</button>
            </div>
          </div>
        )}
        <div className={isGuest ? "filter blur-sm" : ""}>
        {!activeBookingCodes ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : activeBookingCodes.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">🎫</span>
            <p className="text-gray-500 mb-2">No active booking codes</p>
            <p className="text-sm text-gray-400">Create one to share with friends</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBookingCodes.map((bookingCode, index) => (
              <motion.div
                key={bookingCode._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-mono font-bold text-lg text-blue-600">
                        {bookingCode.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(bookingCode.code)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        📋
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{bookingCode.platform}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(bookingCode.status)}`}>
                    {bookingCode.status}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3">{bookingCode.description}</p>

                <div className="space-y-1 mb-3">
                  {bookingCode.matchDetails?.slice(0, 2).map((match: any) => (
                    <div key={match._id} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                      {match.homeTeam} vs {match.awayTeam}
                    </div>
                  ))}
                  {bookingCode.matchDetails && bookingCode.matchDetails.length > 2 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{bookingCode.matchDetails.length - 2} more matches
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      Odds: <span className="font-semibold text-gray-800">{bookingCode.odds.toFixed(2)}</span>
                    </span>
                    <span className="text-gray-600">
                      Stake: <span className="font-semibold text-gray-800">GH₵{bookingCode.stake}</span>
                    </span>
                  </div>
                  <span className="text-green-600 font-semibold">
                    Win: GH₵{bookingCode.potentialWin.toFixed(2)}
                  </span>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Expires: {formatDate(bookingCode.expiresAt)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </div>

      {showSignUpPrompt && <SignUpPromptModal onClose={() => setShowSignUpPrompt(false)} />}

      {showCreateModal && (
        <CreateBookingCodeModal onClose={() => setShowCreateModal(false)} />
      )}
    </motion.div>
  );
}

function CreateBookingCodeModal({ onClose }: { onClose: () => void }) {
  const createBookingCode = useMutation(api.bookingCodes.createBookingCode);
  const upcomingMatches = useQuery(api.matches.getUpcomingMatches, { limit: 10 });
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    code: "",
    platform: "Betway",
    description: "",
    odds: 2.0,
    stake: 10,
    expiresInDays: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMatches.length === 0) {
      toast.error("Please select at least one match");
      return;
    }

    try {
      const expiresAt = Date.now() + (formData.expiresInDays * 24 * 60 * 60 * 1000);
      
      await createBookingCode({
        code: formData.code,
        platform: formData.platform,
        matches: selectedMatches as any,
        description: formData.description,
        odds: formData.odds,
        stake: formData.stake,
        expiresAt,
      });
      
      toast.success("Booking code created!");
      onClose();
    } catch (error) {
      toast.error("Failed to create booking code");
    }
  };

  const toggleMatch = (matchId: string) => {
    setSelectedMatches(prev =>
      prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Create Booking Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., ABC123XYZ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Betway</option>
              <option>Bet365</option>
              <option>1xBet</option>
              <option>SportyBet</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Brief description of this booking code..."
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Odds
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.odds}
                onChange={(e) => setFormData({ ...formData, odds: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stake (GH₵)
              </label>
              <input
                type="number"
                value={formData.stake}
                onChange={(e) => setFormData({ ...formData, stake: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires In
              </label>
              <select
                value={formData.expiresInDays}
                onChange={(e) => setFormData({ ...formData, expiresInDays: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={1}>1 day</option>
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
                <option value={7}>1 week</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Matches ({selectedMatches.length} selected)
            </label>
            <div className="border rounded-lg max-h-60 overflow-y-auto">
              {!upcomingMatches ? (
                <div className="p-4 text-center text-gray-500">Loading matches...</div>
              ) : upcomingMatches.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No upcoming matches</div>
              ) : (
                <div className="divide-y">
                  {upcomingMatches.map((match) => (
                    <label
                      key={match._id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMatches.includes(match._id)}
                        onChange={() => toggleMatch(match._id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {match.homeTeam} vs {match.awayTeam}
                        </p>
                        <p className="text-xs text-gray-500">{match.league}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Potential Win:</strong> GH₵{(formData.stake * formData.odds).toFixed(2)}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Booking Code
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
