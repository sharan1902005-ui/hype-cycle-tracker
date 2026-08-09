"use client";

import { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import type { AnalysisResponse } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const EMPTY_VALUE = "N/A";

const formatNumber = (value: number | undefined) =>
  value === undefined ? EMPTY_VALUE : value.toLocaleString();

const formatPercent = (value: number | undefined) =>
  value === undefined ? EMPTY_VALUE : `${Math.round(value * 100)}%`;

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/analyze/${encodeURIComponent(keyword)}`);
      setResults(res.data);
    } catch {
      alert("Backend connection failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#040816] text-white flex">
      <Sidebar active="Search" />

      <main className="flex-1 px-10 py-8">
        <h1 className="text-4xl font-bold mb-2">Search</h1>
        <p className="text-gray-400 mb-8">Analyze any emerging technology</p>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-cyan-400"
              placeholder="Search any technology..."
            />
          </div>
          <button
            onClick={search}
            className="px-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {results && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-bold capitalize mb-2">{results.keyword}</h2>
            <p className="text-cyan-400 text-xl mb-4">{results.analysis?.stage}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-gray-400 text-sm">GitHub Repos</p>
                <p className="text-3xl font-bold">{formatNumber(results.github?.repo_count)}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-gray-400 text-sm">News Articles</p>
                <p className="text-3xl font-bold">{formatNumber(results.news?.article_count)}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-gray-400 text-sm">Reddit Posts</p>
                <p className="text-3xl font-bold">{formatNumber(results.reddit?.post_count)}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-gray-400 text-sm">Sentiment</p>
                <p className="text-3xl font-bold">{formatPercent(results.sentiment?.positive)}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
