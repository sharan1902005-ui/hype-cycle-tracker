"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  Globe,
} from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#040816] text-white relative overflow-hidden flex items-center justify-center px-6">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 120, 0], y: [0, -100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-20 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"
        />
        <motion.div
          animate={{ x: [0, -120, 0], y: [0, 120, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-20 w-[450px] h-[450px] bg-purple-600/10 blur-3xl rounded-full"
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-2xl"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles size={22} />
          </div>

          <h1 className="text-2xl font-bold mt-4">Welcome Back</h1>

          <p className="text-gray-400 mt-1 text-sm text-center">
            Sign in to your Hype Cycle dashboard
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400">
              <input type="checkbox" />
              Remember me
            </label>

            <button className="text-cyan-300 hover:text-cyan-200">
              Forgot password?
            </button>
          </div>

          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition shadow-lg shadow-cyan-500/20">
            Sign In
            <ArrowRight size={15} />
          </button>

          <button className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm flex items-center justify-center gap-2">
            <Globe size={15} />
            Continue with GitHub
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don&apos;t have an account?{" "}
          <button className="text-purple-300 hover:text-purple-200">
            Create one
          </button>
        </p>
      </motion.div>
    </div>
  );
}
