"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("superadmin@gmail.com");
  const [password, setPassword] = useState("superadmin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for error parameter in URL (from middleware)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'access_denied') {
      setError('Access denied. You need administrator privileges to access this area.');
    }
  }, [searchParams]);

  // Clear error when user starts typing
  const clearError = () => {
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      // Store token in cookies for server-side access
      document.cookie = `adminToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
      
      // Also store in localStorage for client-side access
      localStorage.setItem("adminToken", data.token);
      
      // Store user information
      if (data.user) {
        localStorage.setItem("userInfo", JSON.stringify(data.user));
      }
      
      // Redirect to admin dashboard
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      
      // Special handling for pending accounts
      if (err.message && err.message.includes("pending approval")) {
        setError("Your account is pending administrator approval. Please check back later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-purple-50 to-blue-100">
      <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none"></div>
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
          Admin Login
        </motion.h1>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 border-l-4 border-red-500 bg-red-50/10 text-red-300 rounded"
          >
            <div className="flex items-center">
              <FiAlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          <motion.div variants={itemVariants} className="relative">
            <FiMail className="absolute left-1 top-2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              className="w-full py-2 pl-8 pr-3 bg-transparent text-white border-b border-gray-500 focus:border-blue-400 outline-none transition-colors duration-300 placeholder-gray-400"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative">
            <FiLock className="absolute left-1 top-2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              className="w-full py-2 pl-8 pr-10 bg-transparent text-white border-b border-gray-500 focus:border-blue-400 outline-none transition-colors duration-300 placeholder-gray-400"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-1 top-2 text-gray-400 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </motion.div>
          
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-300 to-purple-300 text-indigo-900 font-semibold flex items-center justify-center transition-transform duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <FiArrowRight className="ml-2" size={18} />}
          </motion.button>
        </motion.form>
        
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <Link 
            href="/admin/signup" 
            className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200"
          >
            Don't have an account? Sign Up
          </Link>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
} 