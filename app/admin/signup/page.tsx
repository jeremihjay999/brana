"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Show success message about pending approval
      setSuccess(`Account created successfully! Your account is pending approval by an administrator. You'll be notified when your account is activated.`);
      
      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      
      // Don't redirect - wait for admin approval
    } catch (err: any) {
      setError(err.message || "Error creating account");
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
          Create an Account
        </motion.h1>
        
        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          <motion.div variants={itemVariants} className="relative">
            <FiUser className="absolute left-1 top-2 text-gray-400" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full py-2 pl-8 pr-3 bg-transparent text-white border-b border-gray-500 focus:border-blue-400 outline-none transition-colors duration-300 placeholder-gray-400"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative">
            <FiMail className="absolute left-1 top-2 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-2 pl-8 pr-3 bg-transparent text-white border-b border-gray-500 focus:border-blue-400 outline-none transition-colors duration-300 placeholder-gray-400"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative">
            <FiLock className="absolute left-1 top-2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
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

          <motion.div variants={itemVariants} className="relative">
            <FiLock className="absolute left-1 top-2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full py-2 pl-8 pr-10 bg-transparent text-white border-b border-gray-500 focus:border-blue-400 outline-none transition-colors duration-300 placeholder-gray-400"
              required
            />
          </motion.div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-emerald-400 text-sm text-center"
            >
              {success}
            </motion.div>
          )}
          
          <motion.div variants={itemVariants} className="text-gray-400 text-xs text-center mt-2">
            Note: New accounts require administrator approval before you can log in.
          </motion.div>
          
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-300 to-purple-300 text-indigo-900 font-semibold flex items-center justify-center transition-transform duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
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
            href="/admin/login" 
            className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200"
          >
            Already have an account? Sign In
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