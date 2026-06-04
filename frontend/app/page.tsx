"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-hidden">

      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#06b6d455,transparent_40%),radial-gradient(circle_at_bottom_right,#9333ea55,transparent_40%)]" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute top-32 left-16 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-xl animate-pulse">
            AI Agents
          </div>

          <div className="absolute top-56 right-20 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 backdrop-blur-xl animate-pulse">
            Quantum Computing
          </div>

          <div className="absolute bottom-52 left-24 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-400/20 backdrop-blur-xl animate-pulse">
            Blockchain
          </div>

          <div className="absolute bottom-32 right-16 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-xl animate-pulse">
            Cybersecurity
          </div>

        </div>

        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-2xl">
            <Sparkles size={40} />
          </div>
        </div>

        <div className="mb-6">

          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Hype Cycle Tracker
          </h1>

          <TypeAnimation
            sequence={[
              "Artificial Intelligence",
              2000,
              "Quantum Computing",
              2000,
              "Blockchain",
              2000,
              "Cybersecurity",
              2000,
              "AI Agents",
              2000,
            ]}
            wrapper="span"
            speed={40}
            repeat={Infinity}
            className="text-2xl md:text-4xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          />

        </div>

        <p className="text-xl text-gray-300 max-w-3xl mb-10">
          Discover emerging technologies using
          GitHub adoption, media buzz,
          community activity and AI-powered
          sentiment analysis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 max-w-6xl">

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="font-bold mb-2">GitHub Adoption</h3>
            <p className="text-gray-400 text-sm">Track developer momentum and repository growth.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="font-bold mb-2">Media Buzz</h3>
            <p className="text-gray-400 text-sm">Monitor global news and technology coverage.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="font-bold mb-2">Community Activity</h3>
            <p className="text-gray-400 text-sm">Analyze discussions and engagement signals.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="font-bold mb-2">AI Sentiment</h3>
            <p className="text-gray-400 text-sm">Measure public perception with AI.</p>
          </div>

        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-10 text-center">

          <div>
            <h2 className="text-3xl font-bold text-cyan-400">10K+</h2>
            <p className="text-gray-400">Repositories Tracked</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-purple-400">500+</h2>
            <p className="text-gray-400">Technologies</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-pink-400">Live</h2>
            <p className="text-gray-400">Analytics</p>
          </div>

        </div>

        <Link href="/dashboard">
          <button
            className="
            group
            relative
            px-10
            py-5
            rounded-2xl
            overflow-hidden
            font-semibold
            text-lg
            bg-gradient-to-r
            from-cyan-500
            via-blue-500
            to-purple-600
            hover:scale-105
            transition-all
            shadow-[0_0_40px_rgba(6,182,212,0.3)]
            "
          >
            <span className="relative z-10 flex items-center gap-3">
              Get Started
              <ArrowRight
                className="group-hover:translate-x-1 transition"
                size={22}
              />
            </span>
          </button>
        </Link>

        <div className="absolute bottom-6 text-gray-500 text-sm">
          Built with Next.js • FastAPI • AI Analytics
        </div>

      </div>
    </main>
  );
}
