import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
import { AdminPanel } from "./components/AdminPanel";
import { LandingPage } from "./components/LandingPage";
import { ChatPanel } from "./components/ChatPanel";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "admin">("dashboard");

  return (
    <>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
      
      <Authenticated>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="container mx-auto px-4 py-8">
            <Content activeTab={activeTab} />
          </main>
          <ChatPanel />
        </div>
      </Authenticated>
      
      <Toaster position="top-right" richColors />
    </>
  );
}

function Content({ activeTab }: { activeTab: "dashboard" | "admin" }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const makeUserAdmin = useMutation(api.admin.makeUserAdmin);

  const handleMakeMeAdmin = async () => {
    if (!loggedInUser?._id) return;
    try {
      await makeUserAdmin({ userId: loggedInUser._id });
      toast.success("You are now an admin! Refresh the page.");
    } catch (error) {
      toast.error("Failed to make you admin");
    }
  };

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
        >
          ⚽ FootyFortunes.Win
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Get AI-powered football betting predictions with confidence levels, analytics, and community insights - completely FREE!
        </motion.p>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border p-4 inline-block"
        >
          <div>
            <p className="text-lg text-gray-700">
              Welcome back, <span className="font-semibold text-blue-600">{loggedInUser?.email ?? "friend"}</span>!
              {loggedInUser?.role === "admin" && (
                <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                  👑 Admin
                </span>
              )}
            </p>
            {loggedInUser?.role !== "admin" && (
              <button
                onClick={handleMakeMeAdmin}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                👑 Make Me Admin
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard />
          </motion.div>
        ) : (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
