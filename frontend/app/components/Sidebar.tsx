"use client";

import Link from "next/link";
import {
  Home,
  Search,
  Cpu,
  Bookmark,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: <Home size={20} />, href: "/" },
  { label: "Search", icon: <Search size={20} />, href: "/search" },
  { label: "Technologies", icon: <Cpu size={20} />, href: "/technologies" },
  { label: "Watchlist", icon: <Bookmark size={20} />, href: "/watchlist" },
  { label: "Reports", icon: <BarChart3 size={20} />, href: "/reports" },
  { label: "Settings", icon: <Settings size={20} />, href: "/settings" },
];

export default function Sidebar({ active }: { active: string }) {
  return (
    <aside className="w-72 min-h-screen border-r border-white/10 bg-white/5 backdrop-blur-xl p-6 shrink-0">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
          <Sparkles />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Hype Cycle</h1>
          <p className="text-purple-300">Tracker</p>
        </div>
      </div>

      <nav className="space-y-3">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <div
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition cursor-pointer ${
                active === item.label
                  ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 border border-purple-400/20"
                  : "hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
