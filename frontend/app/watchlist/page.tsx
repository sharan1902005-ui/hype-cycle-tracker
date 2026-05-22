"use client";

import { useState } from "react";
import { Bookmark, X } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([
    "artificial intelligence",
    "quantum computing",
    "llm",
  ]);
  const [input, setInput] = useState("");

  const add = () => {
    if (!input.trim() || watchlist.includes(input.toLowerCase())) return;
    setWatchlist([...watchlist, input.toLowerCase()]);
    setInput("");
  };

  const remove = (item: string) => {
    setWatchlist(watchlist.filter((w) => w !== item));
  };

  return (
    <div className="min-h-screen bg-[#040816] text-white flex">
      <Sidebar active="Watchlist" />

      <main className="flex-1 px-10 py-8">
        <h1 className="text-4xl font-bold mb-2">Watchlist</h1>
        <p className="text-gray-400 mb-8">Track your favourite technologies</p>

        <div className="flex gap-4 mb-8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400"
            placeholder="Add a technology..."
          />
          <button
            onClick={add}
            className="px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold"
          >
            Add
          </button>
        </div>

        <div className="space-y-4">
          {watchlist.length === 0 && (
            <p className="text-gray-500">No technologies in your watchlist yet.</p>
          )}
          {watchlist.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="text-cyan-400" size={18} />
                <span className="capitalize font-medium">{item}</span>
              </div>
              <button onClick={() => remove(item)}>
                <X className="text-gray-500 hover:text-red-400 transition" size={18} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
