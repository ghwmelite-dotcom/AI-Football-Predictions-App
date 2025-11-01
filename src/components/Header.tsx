import { Authenticated } from "convex/react";
import { SignOutButton } from "../SignOutButton";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface HeaderProps {
  activeTab: "dashboard" | "admin";
  setActiveTab: (tab: "dashboard" | "admin") => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isAdmin = loggedInUser?.role === "admin";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-2xl"
          >
            ⚽
          </motion.span>
          <h2 className="text-xl font-bold text-gray-800">FootyFortunes.Win</h2>
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            FREE
          </motion.span>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("dashboard")}
            className={`transition-colors ${
              activeTab === "dashboard"
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Dashboard
          </motion.button>
          
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("admin")}
              className={`transition-colors flex items-center space-x-1 ${
                activeTab === "admin"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <span>👑</span>
              <span>Admin</span>
            </motion.button>
          )}
        </nav>
        
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </div>
    </motion.header>
  );
}
