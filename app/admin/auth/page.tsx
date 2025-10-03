"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // For stars animation
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);

  useEffect(() => {
    // Create 100 stars with random positions and sizes
    const starsArray = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2
    }));
    setStars(starsArray);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Security protocols do not match");
      return;
    }

    const endpoint = isLogin ? "/api/admin/auth/login" : "/api/admin/auth/signup";
    const payload = isLogin 
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Authentication failed");

      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      router.push("/admin");
    } catch (error) {
      setError(isLogin ? "Access denied: Invalid credentials" : "Identity verification failed");
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-900 to-blue-800 overflow-hidden">
      {/* Stars */}
      <div className="fixed inset-0 z-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 1.5, star.opacity],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-md px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="glassmorphic bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-xl"
          >
            {/* Logo Animation */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                className="w-20 h-20 relative mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75 blur-md" />
                <div className="absolute inset-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border border-white/30" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-white font-[Orbitron] tracking-wider uppercase">{isLogin ? "SYSTEM ACCESS" : "NEW IDENTITY"}</h1>
              <p className="text-blue-300 text-sm mt-1 font-[Rajdhani]">
                {isLogin ? "ENTER CREDENTIALS TO PROCEED" : "REGISTRATION SEQUENCE INITIATED"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative group"
                  >
                    <FiUser className="absolute left-3 top-3.5 text-blue-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-transparent text-white border-b border-white/30 focus:border-blue-400 outline-none transition-colors font-[Rajdhani]"
                      placeholder="Operative Name"
                      required={!isLogin}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-focus-within:w-full transition-all duration-300" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <FiMail className="absolute left-3 top-3.5 text-blue-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-transparent text-white border-b border-white/30 focus:border-blue-400 outline-none transition-colors font-[Rajdhani]"
                  placeholder="Identity Code"
                  required
                />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-focus-within:w-full transition-all duration-300" />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-3 top-3.5 text-blue-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-transparent text-white border-b border-white/30 focus:border-blue-400 outline-none transition-colors font-[Rajdhani]"
                  placeholder="Security Protocol"
                  required
                />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-focus-within:w-full transition-all duration-300" />
              </div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative group"
                  >
                    <FiLock className="absolute left-3 top-3.5 text-blue-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-transparent text-white border-b border-white/30 focus:border-blue-400 outline-none transition-colors font-[Rajdhani]"
                      placeholder="Verify Protocol"
                      required={!isLogin}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-focus-within:w-full transition-all duration-300" />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center border border-red-500/30 py-2 px-3 rounded-lg bg-red-500/10 backdrop-blur-sm font-[Rajdhani]"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold font-[Rajdhani] relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center uppercase tracking-wider">
                  {isLogin ? "Initialize Access" : "Complete Registration"}
                  <FiArrowRight className="ml-2" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-500/30 blur-xl" />
                </div>
              </motion.button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center">
              <motion.button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-300 hover:text-white font-[Rajdhani] text-sm transition-colors relative"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10 tracking-wide">
                  {isLogin ? "Register New Identity" : "Return to Login"}
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 transition-transform duration-300 hover:scale-x-100 origin-left" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Credits */}
        <div className="text-center mt-4 text-blue-300/50 text-xs font-[Rajdhani]">
          SYSTEM VERSION 3.7.8 // QUANTUM AUTHENTICATION PROTOCOL
        </div>
      </div>
    </div>
  );
} 