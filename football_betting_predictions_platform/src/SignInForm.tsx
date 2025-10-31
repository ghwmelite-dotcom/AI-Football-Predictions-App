"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-300 ml-1">Email Address</label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all text-white placeholder-gray-400"
            type="email"
            name="email"
            placeholder="your@email.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-300 ml-1">Password</label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all text-white placeholder-gray-400"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>
        <button 
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-base hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-1" 
          type="submit" 
          disabled={submitting}
        >
          {submitting ? "Loading..." : (flow === "signIn" ? "Sign In" : "Sign Up")}
        </button>
        <div className="text-center text-sm text-gray-300">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-purple-400 hover:text-purple-300 hover:underline font-semibold cursor-pointer transition-colors"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-4">
        <hr className="grow border-white/20" />
        <span className="mx-3 text-gray-400 font-medium text-sm">or</span>
        <hr className="grow border-white/20" />
      </div>
      <button 
        className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white font-semibold text-base hover:bg-white/20 hover:border-white/30 transition-all" 
        onClick={() => void signIn("anonymous")}
      >
        🎭 Continue as Guest
      </button>
    </div>
  );
}
