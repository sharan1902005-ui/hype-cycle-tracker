"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  TrendingUp,
  Globe,
  Newspaper,
  MessageCircle,
  Brain,
  Zap,
  Sparkles,
  X,
  ExternalLink,
  Info,
} from "lucide-react";

const stagePositions: Record<string, number> = {
  "Innovation Trigger": 10,
  "Peak of Inflated Expectations": 30,
  "Trough of Disillusionment": 52,
  "Slope of Enlightenment": 75,
  "Plateau of Productivity": 92,
};

const stageDescriptions: Record<string, string> = {
  "Innovation Trigger":
    "Early excitement. Technology is emerging, but practical adoption is still low.",
  "Peak of Inflated Expectations":
    "Maximum hype. Expectations are extremely high, but reality may not match.",
  "Trough of Disillusionment":
    "Initial hype fades. Failures and skepticism increase.",
  "Slope of Enlightenment":
    "Real-world understanding improves. Practical use cases emerge.",
  "Plateau of Productivity":
    "Technology matures. Stable adoption and real business value.",
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 rounded-3xl p-8 w-[90%] max-w-2xl shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{title}</h2>

              <button onClick={onClose}>
                <X className="text-zinc-400 hover:text-white" />
              </button>
            </div>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  value: any;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl text-left w-full hover:border-cyan-500 transition"
    >
      <div className="text-cyan-400 mb-4 text-2xl">{icon}</div>
      <h3 className="text-zinc-400">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm text-zinc-500 mt-2">{subtitle}</p>
    </motion.button>
  );
}

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [sentimentOpen, setSentimentOpen] = useState(false);
  const [trendOpen, setTrendOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);

  const analyzeKeyword = async (searchTerm?: string) => {
    const query = searchTerm || keyword;

    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/analyze/${query}`
      );

      setResult(response.data);
      setKeyword(query);
    } catch {
      setResult(null);
      alert("Backend connection failed. Make sure the server is running.");
    }

    setLoading(false);
  };

  const sentimentData = result?.sentiment
    ? [
        { name: "Positive", value: result.sentiment.positive * 100 },
        { name: "Negative", value: result.sentiment.negative * 100 },
        { name: "Neutral", value: result.sentiment.neutral * 100 },
      ]
    : [];

  const trendData =
    result?.trends?.trend_points?.length > 0
      ? result.trends.trend_points.map((value: number, index: number) => ({
          name: index,
          value,
        }))
      : [
          { name: 1, value: 20 },
          { name: 2, value: 35 },
          { name: 3, value: 28 },
          { name: 4, value: 55 },
          { name: 5, value: 62 },
          { name: 6, value: 58 },
          { name: 7, value: 74 },
        ];

  const COLORS = ["#06b6d4", "#ef4444", "#6b7280"];

  const stagePosition = result?.analysis
    ? stagePositions[result.analysis.stage] || 50
    : 50;

  const aiExplanation = result?.analysis
    ? `Strong GitHub adoption, media attention, community engagement, trend momentum, and AI sentiment indicate ${result.analysis.stage.toLowerCase()}.`
    : "";
      return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Hype Cycle Tracker
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Real-time Gartner-style technology hype intelligence
          </p>
        </motion.div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search AI, blockchain, quantum..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") analyzeKeyword();
            }}
            className="flex-1 p-5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white text-lg outline-none focus:border-cyan-400 shadow-lg"
          />

          <button
            onClick={() => analyzeKeyword()}
            disabled={loading}
            className="px-8 rounded-2xl bg-cyan-500 hover:bg-cyan-400 font-bold transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            "llm",
            "artificial intelligence",
            "blockchain",
            "quantum computing",
            "web3",
            "metaverse",
            "ai agents",
          ].map((term) => (
            <button
              key={term}
              onClick={() => analyzeKeyword(term)}
              className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 hover:border-cyan-400 text-sm transition"
            >
              {term}
            </button>
          ))}
        </div>

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >

            {/* Hero */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-5xl font-bold">{result.keyword}</h2>

                  <div className="flex items-center gap-3 mt-4">
                    <Sparkles className="text-cyan-400" />
                    <p className="text-cyan-400 text-xl font-semibold">
                      {result.analysis.stage}
                    </p>
                  </div>

                  <p className="text-zinc-400 mt-4 leading-relaxed max-w-3xl">
                    {aiExplanation}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-zinc-500">Confidence</p>
                  <p className="text-4xl font-bold">
                    {Math.round(result.analysis.confidence * 100)}%
                  </p>

                  <span
                    className={`mt-3 inline-block px-4 py-2 rounded-full text-sm border ${
                      result.source === "live"
                        ? "bg-green-900/30 border-green-500 text-green-400"
                        : "bg-cyan-900/30 border-cyan-500 text-cyan-400"
                    }`}
                  >
                    {result.source}
                  </span>
                </div>
              </div>

              <div className="mt-8 h-3 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.analysis.hype_score}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                />
              </div>
            </div>

            {/* Gartner curve */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setStageOpen(true)}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 cursor-pointer"
            >
              <div className="flex justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  Gartner Hype Curve Position
                </h3>

                <Info className="text-zinc-400" />
              </div>

              <div className="relative h-56">
                <svg viewBox="0 0 1000 300" className="w-full h-full">
                  <path
                    d="M50 250 C180 180, 250 20, 400 40 C500 60, 450 250, 620 250 C760 250, 760 120, 950 150"
                    stroke="#06b6d4"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                <motion.div
                  initial={{ left: "0%" }}
                  animate={{ left: `${stagePosition}%` }}
                  transition={{ duration: 1.2 }}
                  className="absolute top-[42%] w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_20px_#06b6d4]"
                />
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6">

              <StatCard
                icon={<Globe />}
                title="GitHub"
                value={result.github.repo_count}
                subtitle={`Stars: ${result.github.total_stars_top10}`}
                onClick={() =>
                  window.open(
                    `https://github.com/search?q=${result.keyword}`,
                    "_blank"
                  )
                }
              />

              <StatCard
                icon={<Newspaper />}
                title="News"
                value={result.news.article_count}
                subtitle="Media hype"
                onClick={() =>
                  window.open(
                    `https://news.google.com/search?q=${result.keyword}`,
                    "_blank"
                  )
                }
              />

              <StatCard
                icon={<MessageCircle />}
                title="Reddit"
                value={result.reddit.post_count}
                subtitle={`Engagement: ${result.reddit.engagement}`}
                onClick={() =>
                  window.open(
                    `https://www.reddit.com/search/?q=${result.keyword}`,
                    "_blank"
                  )
                }
              />

              <StatCard
                icon={<Brain />}
                title="Sentiment"
                value={`${Math.round(result.sentiment.positive * 100)}%`}
                subtitle="Click for details"
                onClick={() => setSentimentOpen(true)}
              />
            </div>
                        {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8">

              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => setTrendOpen(true)}
                className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-cyan-400" />
                    <h3 className="text-xl font-bold">Trend Momentum</h3>
                  </div>

                  <ExternalLink className="text-zinc-400" />
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#06b6d4"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="text-cyan-400" />
                  <h3 className="text-xl font-bold">Sentiment Analysis</h3>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      dataKey="value"
                      outerRadius={100}
                      label
                    >
                      {sentimentData.map((_: any, index: number) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center text-zinc-500 text-sm">
          Built by JD • AI-powered hype intelligence tracker
        </footer>
      </div>

      {/* Sentiment Modal */}
      <Modal
        isOpen={sentimentOpen}
        onClose={() => setSentimentOpen(false)}
        title="Detailed Sentiment Breakdown"
      >
        {result && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Positive</span>
              <span>{Math.round(result.sentiment.positive * 100)}%</span>
            </div>

            <div className="flex justify-between">
              <span>Negative</span>
              <span>{Math.round(result.sentiment.negative * 100)}%</span>
            </div>

            <div className="flex justify-between">
              <span>Neutral</span>
              <span>{Math.round(result.sentiment.neutral * 100)}%</span>
            </div>

            <p className="text-zinc-400 pt-4">
              Sentiment is derived using transformer-based NLP over Reddit titles
              and media headlines.
            </p>
          </div>
        )}
      </Modal>

      {/* Trend Modal */}
      <Modal
        isOpen={trendOpen}
        onClose={() => setTrendOpen(false)}
        title="Expanded Trend Momentum"
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData}>
            <CartesianGrid stroke="#27272a" />
            <XAxis dataKey="name" stroke="#71717a" />
            <YAxis stroke="#71717a" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </Modal>

      {/* Stage Modal */}
      <Modal
        isOpen={stageOpen}
        onClose={() => setStageOpen(false)}
        title="Hype Stage Explanation"
      >
        {result && (
          <div>
            <h3 className="text-cyan-400 text-xl font-semibold mb-4">
              {result.analysis.stage}
            </h3>

            <p className="text-zinc-300 leading-relaxed">
              {stageDescriptions[result.analysis.stage]}
            </p>
          </div>
        )}
      </Modal>
    </main>
  );
}