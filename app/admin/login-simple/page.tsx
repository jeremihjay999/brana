"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function SimpleLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      router.push("/admin");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a40]">
      <div className="w-full max-w-md p-8 mx-4 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-semibold text-white mb-8 text-center">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute left-0 top-0 flex items-center pl-3 h-full text-white/50">
              <FiMail />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pl-10 pr-3 border-b border-white/30 bg-transparent text-white placeholder-white/50 focus:outline-none focus:border-white/70"
              required
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-0 top-0 flex items-center pl-3 h-full text-white/50">
              <FiLock />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-10 pr-3 border-b border-white/30 bg-transparent text-white placeholder-white/50 focus:outline-none focus:border-white/70"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-full bg-[#a8a8d0] text-indigo-900 font-semibold hover:bg-white transition-colors duration-300"
          >
            Submit
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link 
            href="/admin/signup-simple" 
            className="text-white/70 hover:text-white text-sm"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
} 