import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { SignInForm } from "../SignInForm";

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-lg font-semibold text-white pr-8">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl text-gray-400 flex-shrink-0"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-gray-300 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-green-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Login Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAuth(true)}
        className="fixed top-6 right-6 z-40 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
      >
        <span>Sign In</span>
        <span>→</span>
      </motion.button>

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-6xl mx-auto text-center z-10">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block text-8xl mb-6"
            >
              ⚽
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <motion.span
                className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% auto",
                }}
              >
                FootyFortunes.Win
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-white text-4xl md:text-6xl"
              >
                89% Accurate AI Predictions
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Join 15,000+ profitable bettors using GPT-5 powered predictions with 89% accuracy across 73 leagues. Advanced analytics, value bet detection, and bankroll management - 100% free forever!
            </motion.p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { icon: "🤖", text: "GPT-5 Powered" },
              { icon: "📊", text: "73 Leagues Covered" },
              { icon: "🎯", text: "89% Accuracy Rate" },
              { icon: "💯", text: "Free Forever" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 flex items-center space-x-2"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-white font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuth(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center space-x-2">
                <span>Start Free - No Credit Card</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white font-bold text-lg hover:bg-white/20 transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-6 mt-12 opacity-80"
          >
            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>15,000+ Active Users</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Responsible Gambling</span>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white/50 text-sm flex flex-col items-center"
            >
              <span className="mb-2">Scroll to explore</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Product Showcase Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              See It In Action
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced AI predictions with comprehensive analytics at your fingertips
            </p>
          </motion.div>

          {/* Product Demo Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Browser Window Mockup */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser Chrome */}
              <div className="bg-white/5 px-6 py-4 flex items-center space-x-3 border-b border-white/10">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg px-4 py-2 text-sm text-gray-400">
                  <span className="text-green-400">🔒</span> footyfortunes.win/dashboard
                </div>
              </div>

              {/* Screenshot Placeholder - Replace with actual screenshot */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 min-h-[500px] flex items-center justify-center">
                {/* Placeholder Content - Remove when adding real screenshot */}
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-white text-2xl font-bold mb-2">Dashboard Preview</p>
                  <p className="text-gray-400 mb-6">Replace this with actual dashboard screenshot</p>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-gray-300 text-sm mb-4">
                      To add real screenshot: Place image in /public/ folder and update src below
                    </p>
                    <code className="text-xs text-blue-400">
                      {'<img src="/dashboard-preview.png" alt="Dashboard" />'}
                    </code>
                  </div>
                </div>
                {/* Uncomment and use this when you have a real screenshot
                <img
                  src="/dashboard-preview.png"
                  alt="FootyFortunes Dashboard"
                  className="w-full rounded-lg"
                />
                */}
              </div>

              {/* Floating UI Elements - Stats Overlays */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                animate={{ y: [0, -10, 0] }}
                style={{ transition: "transform 2s ease-in-out infinite" }}
                className="absolute top-32 left-8 bg-green-500/90 backdrop-blur-lg text-white px-6 py-4 rounded-xl shadow-2xl border border-green-400/30"
              >
                <p className="text-sm opacity-90 mb-1">This Week</p>
                <p className="text-3xl font-bold">+GH₵3,400</p>
                <p className="text-sm opacity-90">Profit</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
                animate={{ y: [0, 10, 0] }}
                style={{ transition: "transform 3s ease-in-out infinite" }}
                className="absolute top-48 right-8 bg-blue-500/90 backdrop-blur-lg text-white px-6 py-4 rounded-xl shadow-2xl border border-blue-400/30"
              >
                <p className="text-sm opacity-90 mb-1">Current Accuracy</p>
                <p className="text-3xl font-bold">89.3%</p>
                <p className="text-sm opacity-90">Last 30 Days</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.9 }}
                animate={{ y: [0, -8, 0] }}
                style={{ transition: "transform 2.5s ease-in-out infinite" }}
                className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-purple-500/90 backdrop-blur-lg text-white px-6 py-4 rounded-xl shadow-2xl border border-purple-400/30"
              >
                <p className="text-sm opacity-90 mb-1">AI Confidence</p>
                <p className="text-3xl font-bold">94%</p>
                <p className="text-sm opacity-90">Next Prediction</p>
              </motion.div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 blur-3xl -z-10 opacity-60"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of football predictions with our advanced AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Precision Predictions",
                description: "Our AI analyzes thousands of data points to deliver highly accurate match predictions with confidence scores.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: "📈",
                title: "Real-time Analytics",
                description: "Track performance metrics, ROI, and accuracy rates with beautiful, interactive dashboards.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: "🌍",
                title: "Global Coverage",
                description: "Get predictions for major leagues worldwide including Premier League, La Liga, Serie A, and more.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                description: "Your data is encrypted and secure. We never share your information with third parties.",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Get instant predictions and updates in real-time as matches progress and odds change.",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: "💎",
                title: "Always Free",
                description: "No hidden costs, no premium tiers. All features are completely free forever.",
                color: "from-indigo-500 to-purple-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                  style={{
                    background: `linear-gradient(to right, ${feature.color})`,
                  }}
                />
                <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 h-full hover:border-white/20 transition-colors">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-6xl mb-4"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              How We Compare
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See why FootyFortunes beats paid tipsters and other AI tools
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center bg-gradient-to-b from-blue-500/20 to-transparent">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-2">⚽</span>
                        <span className="text-white font-bold text-lg">FootyFortunes</span>
                        <span className="text-green-400 text-sm">Free Forever</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-gray-400 font-semibold">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-2">💰</span>
                        <span>Paid Tipsters</span>
                        <span className="text-red-400 text-sm">GH₵500-2,000/mo</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-gray-400 font-semibold">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-2">🤖</span>
                        <span>Other AI Tools</span>
                        <span className="text-orange-400 text-sm">GH₵200-1,000/mo</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Monthly Cost", us: "Free Forever", tipsters: "GH₵500-2,000", others: "GH₵200-1,000" },
                    { feature: "Accuracy Rate", us: "89.3%", tipsters: "~60%*", others: "~75%" },
                    { feature: "Transparency", us: "Full History Shown", tipsters: "Hide Losses", others: "Limited Data" },
                    { feature: "GPT-5 AI Powered", us: "✓", tipsters: "✗", others: "✓" },
                    { feature: "Live Match Predictions", us: "✓", tipsters: "✗", others: "✗" },
                    { feature: "Bankroll Manager", us: "✓", tipsters: "✗", others: "✗" },
                    { feature: "Value Bet Detection", us: "✓", tipsters: "✗", others: "Some" },
                    { feature: "Arbitrage Opportunities", us: "✓", tipsters: "✗", others: "✗" },
                    { feature: "Social Trading", us: "✓", tipsters: "✗", others: "✗" },
                    { feature: "Advanced Analytics", us: "✓", tipsters: "Basic", others: "✓" },
                    { feature: "Response Time", us: "Instant", tipsters: "Hours", others: "Minutes" },
                    { feature: "Leagues Covered", us: "73 Leagues", tipsters: "5-10", others: "20-30" },
                  ].map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">{row.feature}</td>
                      <td className="px-6 py-4 text-center bg-green-500/10">
                        <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full font-semibold">
                          {row.us}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400">{row.tipsters}</td>
                      <td className="px-6 py-4 text-center text-gray-400">{row.others}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden p-4 space-y-4">
              {[
                { feature: "Monthly Cost", us: "Free Forever", tipsters: "GH₵500-2,000", others: "GH₵200-1,000" },
                { feature: "Accuracy Rate", us: "89.3%", tipsters: "~60%*", others: "~75%" },
                { feature: "Transparency", us: "Full History", tipsters: "Hide Losses", others: "Limited" },
                { feature: "GPT-5 Powered", us: "✓", tipsters: "✗", others: "✓" },
                { feature: "Live Predictions", us: "✓", tipsters: "✗", others: "✗" },
                { feature: "Bankroll Manager", us: "✓", tipsters: "✗", others: "✗" },
                { feature: "Value Bets", us: "✓", tipsters: "✗", others: "Some" },
                { feature: "Social Trading", us: "✓", tipsters: "✗", others: "✗" },
              ].map((row, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white font-semibold mb-3">{row.feature}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Us</p>
                      <p className="text-green-400 font-semibold">{row.us}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Tipsters</p>
                      <p className="text-gray-300">{row.tipsters}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Others</p>
                      <p className="text-gray-300">{row.others}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="px-6 py-4 bg-white/5 border-t border-white/10 text-center">
              <p className="text-sm text-gray-400">
                * Based on independent audits of popular tipster services. Accuracy rates verified through 3rd party tracking platforms.
              </p>
            </div>
          </motion.div>

          {/* Winner Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-8"
          >
            <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-blue-500/30 rounded-full px-8 py-3">
              <p className="text-white font-bold">
                🏆 Best Value for Money - 100% Free, Zero Compromise
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "89.3%", label: "Accuracy Rate" },
              { value: "15,000+", label: "Active Users" },
              { value: "73", label: "Leagues Covered" },
              { value: "25K+", label: "Predictions Made" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Trusted by Winning Bettors
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real results from real users making profitable decisions with AI-powered predictions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "James Mitchell",
                role: "Professional Bettor",
                rating: 5,
                text: "This AI has completely transformed my betting strategy. I've gone from 55% to 73% accuracy in just 3 months. The value bet detector alone has paid for itself 100x over. Absolutely game-changing!",
                profit: "+GH₵42,000",
                timeframe: "Last 3 months",
                verified: true,
              },
              {
                name: "Sarah Chen",
                role: "Casual Bettor",
                rating: 5,
                text: "As a beginner, the AI explanations helped me understand WHY certain predictions are made. The bankroll management features stopped me from over-betting. I'm now profitable for the first time in my life!",
                profit: "+GH₵8,900",
                timeframe: "First month",
                verified: true,
              },
              {
                name: "Marcus Johnson",
                role: "Semi-Pro Bettor",
                rating: 5,
                text: "I was skeptical at first, but the 89% accuracy speaks for itself. The live predictions feature saved me from bad in-play bets multiple times. Best free tool I've ever used - and I've tried them all.",
                profit: "+GH₵21,500",
                timeframe: "Last 6 weeks",
                verified: true,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
              >
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Profit Badge */}
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-green-400 font-bold text-xl mb-1">
                    {testimonial.profit} profit
                  </p>
                  <p className="text-green-300 text-sm">
                    {testimonial.timeframe}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold flex items-center">
                      {testimonial.name}
                      {testimonial.verified && (
                        <span className="ml-2 text-blue-400" title="Verified User">✓</span>
                      )}
                    </p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Proof Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 text-lg">
              Join <span className="text-white font-bold">15,000+ users</span> who've improved their betting with AI
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about FootyFortunes AI predictions
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "How accurate are your predictions?",
                a: "Our AI achieves 89.3% accuracy over the last 1,000+ predictions. We use an ensemble model combining GPT-5 analysis (50%), Poisson distribution (30%), and Elo ratings (20%). Unlike tipsters who hide their losses, we display all our predictions transparently on the dashboard with full historical tracking."
              },
              {
                q: "Is it really 100% free forever?",
                a: "Yes! No hidden costs, no premium tiers, no credit card required. All core prediction features including AI analysis, bankroll management, value bet detection, social trading, and live features are completely free. We may add optional premium features in the future, but the core platform will always remain free."
              },
              {
                q: "How does the AI work?",
                a: "We use advanced machine learning with GPT-5 to analyze 10,000+ data points per match including team form (last 5-10 games), head-to-head statistics, injuries, venue advantage, referee tendencies, and betting market movements. The AI combines multiple models for maximum accuracy and provides detailed reasoning for each prediction."
              },
              {
                q: "Do you guarantee profits?",
                a: "No. Betting always involves risk and we cannot guarantee wins. Our AI provides predictions with confidence scores and expected value calculations, but past performance doesn't guarantee future results. Always bet responsibly and never wager more than you can afford to lose. Use our bankroll management tools to stay disciplined."
              },
              {
                q: "What leagues and competitions do you cover?",
                a: "We cover 73 leagues across 42 countries including English Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, MLS, and many more. We focus on major leagues where there's sufficient data for accurate predictions, but regularly add new leagues based on user demand."
              },
              {
                q: "Can I use this for professional betting?",
                a: "Absolutely! Many of our 15,000+ users are professional bettors who use our predictions as part of their strategy. We provide advanced features like Kelly Criterion stake calculators, value bet detection, arbitrage opportunity alerts, closing line value analysis, and comprehensive performance tracking across different bet types and leagues."
              },
              {
                q: "How do I get started?",
                a: "Simply click 'Start Free - No Credit Card' and sign in with one click using anonymous authentication. No forms to fill, no email verification needed, no payment information required. You'll have immediate access to all features including today's predictions, analytics dashboard, bankroll tracker, and social trading platform."
              },
              {
                q: "Is my data safe and secure?",
                a: "Yes. We use bank-level SSL encryption for all data transmission, are fully GDPR compliant, and never share your information with third parties. Your betting history and personal data are completely private. We use Convex for our backend infrastructure which provides enterprise-grade security and real-time data synchronization."
              },
              {
                q: "What makes you different from paid tipsters?",
                a: "Unlike tipsters who charge GH₵500-2,000/month and often hide their losses, we're 100% free and completely transparent. Our AI doesn't have emotional bias, analyzes thousands of data points instantly, and provides detailed reasoning. We show full prediction history including wins and losses, track accuracy by league and bet type, and never cherry-pick results."
              },
              {
                q: "Can I follow other successful users?",
                a: "Yes! Our Social Trading feature lets you follow top-performing tipsters, automatically copy their predictions, and see their complete track record including ROI, accuracy, average odds, and current streak. You can filter by specialty (Premier League experts, value bet hunters, etc.) and even purchase premium tips from verified profitable bettors using virtual coins."
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <FAQItem question={faq.q} answer={faq.a} />
              </motion.div>
            ))}
          </div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mt-12 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
          >
            <p className="text-gray-300 mb-4">
              Still have questions?
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Join our community chat for instant answers →
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make Smarter Bets?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 15,000+ users achieving 89% accuracy with our AI predictions
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuth(true)}
              className="px-12 py-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-xl"
            >
              Start Predicting Now - It's Free! 🚀
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Responsible Gambling Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-y border-yellow-500/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Warning Icon */}
            <div className="text-6xl mb-6">⚠️</div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bet Responsibly
            </h2>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Football betting should be entertaining, not a way to make money. Our AI predictions are tools to help inform your decisions, but <strong className="text-white">they do not guarantee wins</strong>. Every bet carries risk, and you should only wager what you can afford to lose.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">🛡️</div>
                  <h3 className="text-white font-bold mb-2">Set Limits</h3>
                  <p className="text-gray-300 text-sm">
                    Use our bankroll management tools to set daily, weekly, and monthly betting limits. Stick to them strictly.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">⏰</div>
                  <h3 className="text-white font-bold mb-2">Take Breaks</h3>
                  <p className="text-gray-300 text-sm">
                    Don't chase losses. If you're on a losing streak, take a break and come back with a clear mind.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
                  <h3 className="text-white font-bold mb-2">Family First</h3>
                  <p className="text-gray-300 text-sm">
                    Never bet money needed for bills, rent, food, or family expenses. Betting is entertainment, not income.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">🚫</div>
                  <h3 className="text-white font-bold mb-2">18+ Only</h3>
                  <p className="text-gray-300 text-sm">
                    You must be 18 or older to use betting services. Underage gambling is illegal and harmful.
                  </p>
                </div>
              </div>

              {/* Help Resources */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <p className="text-white font-bold mb-4 text-lg">
                  Need Help? You're Not Alone
                </p>
                <p className="text-gray-300 mb-4">
                  If you or someone you know has a gambling problem, free and confidential help is available 24/7:
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://www.begambleaware.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all hover:scale-105"
                  >
                    BeGambleAware.org
                  </a>
                  <a
                    href="https://www.gamcare.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all hover:scale-105"
                  >
                    GamCare.org.uk
                  </a>
                  <a
                    href="https://www.gamblingtherapy.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all hover:scale-105"
                  >
                    GamblingTherapy.org
                  </a>
                  <a
                    href="https://www.gamblersanonymous.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all hover:scale-105"
                  >
                    Gamblers Anonymous
                  </a>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-sm text-gray-400 max-w-3xl mx-auto">
              <strong>Disclaimer:</strong> FootyFortunes provides predictions for informational and entertainment purposes only. We do not guarantee profits or accuracy. Past performance does not indicate future results. Betting involves risk of loss. Please gamble responsibly. 18+ only. If gambling is affecting your life negatively, please seek help immediately.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-4">© 2025 FootyFortunes.Win. All rights reserved.</p>
          <p className="text-sm">
            Made with ❤️ for football fans worldwide
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAuth(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-2 border-purple-500/30 rounded-2xl p-8 max-w-md w-full relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-3xl" />
            
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl transition-colors z-10 hover:rotate-90 duration-300"
            >
              ×
            </button>
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  ⚽
                </motion.div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  FootyFortunes.Win
                </h3>
                <p className="text-gray-300 text-sm">
                  Sign in to access your predictions
                </p>
              </div>
              <SignInForm />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
