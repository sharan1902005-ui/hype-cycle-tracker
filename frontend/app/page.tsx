"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Moon,
  Home as HomeIcon,
  Cpu,
  Bookmark,
  BarChart3,
  Settings,
  Sparkles,
  TrendingUp,
  Newspaper,
  MessageCircle,
  Brain,
  ExternalLink,
  Info,
  Atom,
  Menu,
  X,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Sidebar from "./components/Sidebar";
import AIInsights from "./components/AIInsights";
import ComparePanel from "./components/ComparePanel";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const COLORS = ["#06b6d4", "#8b5cf6", "#ec4899"];

export default function Home() {
  const [keyword, setKeyword] = useState("quantum computing");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSentimentModal, setShowSentimentModal] = useState(false);

  const quickTopics = [
    "ai",
    "artificial intelligence",
    "blockchain",
    "quantum computing",
    "web3",
    "metaverse",
    "ai agents",
  ];

  const analyzeTechnology = async (term?: string) => {
    const query = term || keyword;

    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `${API}/analyze/${encodeURIComponent(query)}`
      );

      const payload = res.data;
      console.log("API RESPONSE:", payload);
      console.log("GITHUB:", payload.github);
      console.log("NEWS:", payload.news);
      console.log("REDDIT:", payload.reddit);
      setData(payload);
      setKeyword(query);

      setSearchHistory((prev) => {
        const filtered = prev.filter((x) => x !== query);
        const updated = [query, ...filtered].slice(0, 8);
        localStorage.setItem("searchHistory", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Backend connection failed");
    }

    setLoading(false);
  };

  const compareTechnology = async (term: string) => {
    try {
      const res = await axios.get(`${API}/analyze/${encodeURIComponent(term)}`);
      const payload = res.data;
      const newTech = {
        name: term,
        github: payload?.github?.repo_count || 0,
        news: payload?.news?.article_count || 0,
        reddit: payload?.reddit?.post_count || 0,
        sentiment: Math.round((payload?.sentiment?.positive || 0) * 100),
        stage: payload?.analysis?.stage || "Unknown",
      };
      setCompareData((prev) => {
        const exists = prev.find((x) => x.name === term);
        if (exists) return prev;
        return [...prev, newTech];
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    analyzeTechnology("quantum computing");

    const saved = localStorage.getItem("watchlist");
    if (saved) setWatchlist(JSON.parse(saved));

    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  const removeHistoryItem = (tech: string) => {
    const updated = searchHistory.filter((x) => x !== tech);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const addToWatchlist = () => {
    if (!keyword.trim()) return;
    if (watchlist.includes(keyword)) return;
    const updated = [...watchlist, keyword];
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const removeFromWatchlist = (tech: string) => {
    const updated = watchlist.filter((x) => x !== tech);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const trendLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ];

  const trendData =
    data?.trends?.trend_points?.map(
      (v: number, i: number) => ({
        month: trendLabels[i] || `M${i + 1}`,
        value: v,
      })
    ) || [];

  const sentimentData = [
    {
      name: "Positive",
      value: Math.round((data?.sentiment?.positive || 0) * 100),
    },
    {
      name: "Neutral",
      value: Math.round((data?.sentiment?.neutral || 0) * 100),
    },
    {
      name: "Negative",
      value: Math.round((data?.sentiment?.negative || 0) * 100),
    },
  ];

  return (
    <div className="min-h-screen bg-[#040816] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full" />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <div onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 h-full w-80 bg-[#09111f] border-r border-white/10 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                  <Sparkles />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Hype Cycle</h1>
                  <p className="text-purple-300">Tracker</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <X />
              </button>
            </div>

            <nav className="space-y-3 mb-10">
              <SidebarItem icon={<HomeIcon />} label="Dashboard" active />
              <SidebarItem icon={<Search />} label="Search" />
              <SidebarItem icon={<Cpu />} label="Technologies" />
              <SidebarItem icon={<Bookmark />} label="Watchlist" />
              <SidebarItem icon={<BarChart3 />} label="Reports" />
              <SidebarItem icon={<Settings />} label="Settings" />
            </nav>

            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4">Watchlist</h3>
              <div className="space-y-3">
                {watchlist.map((tech) => (
                  <button key={tech} onClick={() => { analyzeTechnology(tech); setMobileMenuOpen(false); }} className="w-full text-left rounded-2xl border border-white/10 bg-white/5 px-4 py-3 capitalize">
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Search History</h3>
              <div className="space-y-3">
                {searchHistory.map((tech) => (
                  <button key={tech} onClick={() => { analyzeTechnology(tech); setMobileMenuOpen(false); }} className="w-full text-left rounded-2xl border border-white/10 bg-white/5 px-4 py-3 capitalize">
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="relative z-10 flex">
      <aside className="hidden lg:block w-72 min-h-screen border-r border-white/10 bg-white/5 backdrop-blur-xl p-6 shrink-0">
        <Sidebar active="Dashboard" />

        {/* Watchlist */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Watchlist</h3>
          <div className="space-y-3">
            {watchlist.map((tech) => (
              <div key={tech} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <button onClick={() => analyzeTechnology(tech)} className="text-left capitalize hover:text-cyan-300">{tech}</button>
                <button onClick={() => removeFromWatchlist(tech)} className="text-red-400 hover:text-red-300">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Search History */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Search History</h3>
          <div className="space-y-3">
            {searchHistory.map((tech) => (
              <div key={tech} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <button onClick={() => analyzeTechnology(tech)} className="text-left capitalize hover:text-cyan-300">{tech}</button>
                <button onClick={() => removeHistoryItem(tech)} className="text-red-400 hover:text-red-300">×</button>
              </div>
            ))}
          </div>
        </div>
      </aside>

        {/* Main */}
        <main className="flex-1 px-4 md:px-8 lg:px-10 py-6 md:py-8">
          {/* Mobile top nav */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Sparkles />
              </div>
              <h2 className="font-bold text-xl">Hype Cycle</h2>
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Menu />
            </button>
          </div>

          {/* Top */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">Welcome back, JD 👋</h1>
              <p className="text-gray-400 mt-2">
                Real-time emerging technology intelligence
              </p>
            </div>

            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Moon />
              </button>

              <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Bell />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") analyzeTechnology();
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-cyan-400"
                placeholder="Search technology..."
              />
            </div>

            <button
              onClick={() => analyzeTechnology()}
              className="w-full md:w-auto px-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            <button
              onClick={addToWatchlist}
              className="w-full md:w-auto px-6 rounded-2xl border border-purple-400/20 bg-purple-500/10 hover:bg-purple-500/20 transition"
            >
              + Watchlist
            </button>
          </div>

          {/* Quick Topics */}
          <div className="flex flex-wrap gap-3 mb-8">
            {quickTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => analyzeTechnology(topic)}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Compare Buttons */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {["ai", "quantum computing", "blockchain", "web3"].map((tech) => (
              <button
                key={tech}
                onClick={() => compareTechnology(tech)}
                className="px-5 py-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 hover:bg-cyan-500/20 transition"
              >
                Compare {tech}
              </button>
            ))}
          </div>

          {/* Hero */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8">
            <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
              <div className="flex gap-6 flex-1">
                <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                  <Atom className="w-12 h-12 text-cyan-300" />
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl md:text-5xl font-bold capitalize mb-3">
                    {data?.keyword || keyword}
                  </h2>

                  <p className="text-cyan-400 text-xl font-semibold mb-4">
                    {data?.analysis?.stage}
                  </p>

                  <p className="text-gray-300 mb-6">
                    Live AI classification using GitHub, Reddit, News, trends,
                    and sentiment signals.
                  </p>

                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${data?.analysis?.hype_score || 0}%`,
                      }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-72 rounded-3xl border border-white/10 bg-black/20 p-6">
                <p className="text-gray-400 mb-3">Confidence</p>

                <h3 className="text-6xl font-bold">
                  {Math.round((data?.analysis?.confidence || 0) * 100)}%
                </h3>
              </div>
            </div>
          </div>

          <AIInsights data={data} />

          <ComparePanel compareData={compareData} />

          {/* PREMIUM GARTNER */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1025] to-[#060b1a] backdrop-blur-xl p-8 mb-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-20 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full" />
              <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full" />
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-bold">Gartner Hype Curve Position</h3>
                  <Info className="text-gray-400" />
                </div>

                <button
                  onClick={() => window.open("https://www.gartner.com/en/research/methodologies/gartner-hype-cycle", "_blank")}
                  className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
                >
                  View Full Hype Cycle
                  <ExternalLink size={18} />
                </button>
              </div>

              {/* Progress text */}
              <div className="flex justify-between text-sm text-gray-400 mb-6">
                <span>{data?.analysis?.stage}</span>
                <span>{data?.analysis?.hype_score || 0}% progress</span>
              </div>

              {/* Chart */}
              <div className="relative h-[420px]">
                {/* Axis */}
                <div className="absolute left-10 top-10 bottom-20 w-[2px] bg-white/10" />
                <div className="absolute left-10 right-10 bottom-20 h-[2px] bg-white/10" />

                {/* Grid lines */}
                <div className="absolute left-[22%] top-10 bottom-20 w-px bg-white/5" />
                <div className="absolute left-[42%] top-10 bottom-20 w-px bg-white/5" />
                <div className="absolute left-[62%] top-10 bottom-20 w-px bg-white/5" />
                <div className="absolute left-[82%] top-10 bottom-20 w-px bg-white/5" />

                {/* SVG */}
                <svg viewBox="0 0 1200 400" className="w-full h-full absolute inset-0">
                  <path
                    d="M 120 250 C 220 250, 260 80, 450 60 C 600 50, 650 290, 820 270 C 940 250, 1040 110, 1140 120"
                    stroke="url(#gartnerGlow)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />

                  <defs>
                    <linearGradient id="gartnerGlow">
                      <stop offset="0%" stopColor="#00d9ff" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>

                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                </svg>

                {/* Dynamic marker */}
                <motion.div
                  animate={{
                    left:
                      data?.analysis?.hype_score <= 20 ? "16%" :
                      data?.analysis?.hype_score <= 40 ? "34%" :
                      data?.analysis?.hype_score <= 60 ? "56%" :
                      data?.analysis?.hype_score <= 80 ? "74%" : "90%",
                    top:
                      data?.analysis?.hype_score <= 20 ? "48%" :
                      data?.analysis?.hype_score <= 40 ? "22%" :
                      data?.analysis?.hype_score <= 60 ? "56%" :
                      data?.analysis?.hype_score <= 80 ? "48%" : "28%",
                  }}
                  transition={{ duration: 1 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 h-36 border-l-2 border-dashed border-cyan-400/60" />
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-cyan-300 font-medium">Current Position</div>
                  <div className="w-8 h-8 rounded-full bg-cyan-400 border-4 border-white shadow-[0_0_30px_#00d9ff]" />
                </motion.div>

                {/* Labels */}
                <div className="absolute bottom-0 left-[12%] text-center">
                  <p className="text-cyan-300 font-medium">Innovation</p>
                  <p className="text-cyan-300 font-bold">Trigger</p>
                </div>
                <div className="absolute bottom-0 left-[28%] text-center">
                  <p className="text-gray-300">Peak of Inflated</p>
                  <p className="text-gray-300">Expectations</p>
                </div>
                <div className="absolute bottom-0 left-[48%] text-center">
                  <p className="text-gray-300">Trough of</p>
                  <p className="text-gray-300">Disillusionment</p>
                </div>
                <div className="absolute bottom-0 left-[68%] text-center">
                  <p className="text-gray-300">Slope of</p>
                  <p className="text-gray-300">Enlightenment</p>
                </div>
                <div className="absolute bottom-0 left-[86%] -translate-x-1/2 text-center">
                  <p className="text-gray-300">Plateau of</p>
                  <p className="text-gray-300">Productivity</p>
                </div>

                <div className="absolute left-0 top-[45%] -rotate-90 text-gray-400">Expectations</div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400">Time</div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 relative z-50">
            <MetricCard
              title="GitHub Adoption"
              value={data?.github?.repo_count?.toLocaleString() || 0}
              subtitle={
                <>
                  ⭐ {data?.github?.total_stars?.toLocaleString() || 0} stars •{" "}
                  🍴 {data?.github?.total_forks?.toLocaleString() || 0} forks
                </>
              }
              icon={<Cpu className="text-cyan-300" />}
              link={`https://github.com/search?q=${encodeURIComponent(keyword)}`}
            />

            <MetricCard
              title="Media Buzz"
              value={data?.news?.article_count || 0}
              subtitle="Live news articles"
              icon={<Newspaper className="text-purple-300" />}
              link={`https://news.google.com/search?q=${encodeURIComponent(keyword)}`}
            />

            <MetricCard
              title="Community Activity"
              value={data?.reddit?.post_count || 0}
              subtitle={`Engagement: ${data?.reddit?.engagement?.toLocaleString() || 0}`}
              icon={<MessageCircle className="text-orange-300" />}
              link={`https://reddit.com/search/?q=${encodeURIComponent(keyword)}`}
            />

            <MetricCard
              title="AI Sentiment"
              value={`${Math.round((data?.sentiment?.positive || 0) * 100)}%`}
              subtitle="NLP sentiment signal"
              icon={<Brain className="text-pink-300" />}
              onClick={() => setShowSentimentModal(true)}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Trend */}
            <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Trend Momentum</h3>
                  <p className="text-gray-400">Live trend movement</p>
                </div>

                <TrendingUp className="text-cyan-300" />
              </div>

              <ResponsiveContainer width="100%" height={320} minHeight={320}>
                <LineChart data={trendData}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value) => [`${value}`, "Trend Score"]}
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#06b6d4"
                    strokeWidth={4}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Sentiment Analysis</h3>
                <p className="text-gray-400">NLP classification</p>
              </div>

              <div className="relative h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      innerRadius={70}
                      outerRadius={110}
                      dataKey="value"
                    >
                      {sentimentData.map((_: any, index: number) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h4 className="text-4xl font-bold">
                    {Math.round((data?.sentiment?.positive || 0) * 100)}%
                  </h4>
                  <p className="text-gray-400">Positive</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition ${
        active
          ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 border border-purple-400/20"
          : "hover:bg-white/5"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  link,
  onClick,
}: {
  title: string;
  value: any;
  subtitle: string | React.ReactNode;
  icon: React.ReactNode;
  link?: string;
  onClick?: () => void;
}) {
  const content = (
    <motion.div
      whileHover={{ y: -6 }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 cursor-pointer hover:bg-white/10 transition"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <ExternalLink className="text-gray-500" />
      </div>
      <p className="text-gray-400 mb-2">{title}</p>
      <h3 className="text-4xl font-bold mb-2">{value}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </motion.div>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  );
}
