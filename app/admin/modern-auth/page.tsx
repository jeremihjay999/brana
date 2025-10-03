"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ModernAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
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

      if (!response.ok) throw new Error(isLogin ? "Invalid credentials" : "Signup failed");

      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      router.push("/admin");
    } catch (err) {
      setError(isLogin ? "Invalid email or password" : "Failed to create account");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 mx-4 rounded-2xl bg-[#0D014F] shadow-2xl"
      >
        <motion.h1 
          className="text-2xl font-bold text-white mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLogin ? "Welcome Back" : "Create Account"}
        </motion.h1>
        
        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {!isLogin && (
            <motion.div variants={itemVariants} className="relative">
              <FiUser className="absolute left-1 top-2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 pl-8 pr-3 bg-transparent text-white border-b border-gray-500 focus:border-blue-400 outline-none transition-colors duration-300 placeholder-gray-400"
                required={!isLogin}
              />
            </motion.div>
          )}
          
          <motion.div variants={itemVariants} className="relative">
            <FiMail className="absolute left-1 top-2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 pl-8 pr-3 bg-transparent text-white border-b border-gray-500 focus:border-blue-400 outline-none transition-colors duration-300 placeholder-gray-400"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative">
            <FiLock className="absolute left-1 top-2 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 pl-8 pr-3 bg-transparent text-white border-b border-gray-500 focus:border-blue-400 outline-none transition-colors duration-300 placeholder-gray-400"
              required
            />
          </motion.div>
          
          {!isLogin && (
            <motion.div variants={itemVariants} className="relative">
              <FiLock className="absolute left-1 top-2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-2 pl-8 pr-3 bg-transparent text-white border-b border-gray-500 focus:border-blue-400 outline-none transition-colors duration-300 placeholder-gray-400"
                required={!isLogin}
              />
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
          
          <motion.button
            variants={itemVariants}
            type="submit"
            className="w-full mt-8 py-2.5 rounded-2xl bg-gray-300 text-blue-700 font-semibold flex items-center justify-center transition-transform duration-200 hover:scale-[1.02]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLogin ? "Sign In" : "Create Account"}
            <FiArrowRight className="ml-2" size={18} />
          </motion.button>
        </motion.form>
        
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
} 