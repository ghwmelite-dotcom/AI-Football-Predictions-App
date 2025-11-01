import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PredictionsCard } from "./PredictionsCard";
import { AnalyticsCard } from "./AnalyticsCard";
import { MatchesCard } from "./MatchesCard";
import { StatsOverview } from "./StatsOverview";
import { AnimatedButton } from "./AnimatedCard";
import { LiveMatchCard } from "./LiveMatchCard";
import { BookingCodesCard } from "./BookingCodesCard";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function Dashboard() {
  const matches = useQuery(api.matches.getUpcomingMatches, { limit: 5 });
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isAdmin = loggedInUser?.role === "admin";
  const isGuest = loggedInUser?.isAnonymous === true;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Stats Overview */}
      <StatsOverview />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Predictions */}
        <div className="lg:col-span-2 space-y-6">
          <PredictionsCard />
          <AnalyticsCard />
        </div>
        
        {/* Right Column - Matches & Quick Actions */}
        <div className="space-y-6">
          <LiveMatchCard />
          <BookingCodesCard />
          <MatchesCard />
          
          {/* Quick Actions - Admin Only */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <AnimatedButton
                onClick={() => window.location.reload()}
                variant="secondary"
                className="w-full"
              >
                Refresh Predictions
              </AnimatedButton>
            </div>
            </motion.div>
          )}
          
          {/* Free Platform Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
          >
            <div className="flex items-center space-x-2 mb-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                🎉
              </motion.span>
              <h3 className="text-lg font-semibold text-green-800">100% Free Platform</h3>
            </div>
            <p className="text-green-700 text-sm">
              All predictions, analytics, and features are completely free. No hidden costs, no premium tiers!
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
