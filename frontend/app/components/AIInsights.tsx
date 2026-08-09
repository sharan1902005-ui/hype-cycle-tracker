"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import type { AnalysisResponse } from "@/lib/types";

type Props = {
  analysis: AnalysisResponse | null;
};

const formatNumber = (value: number | undefined) =>
  value === undefined ? "N/A" : value.toLocaleString();

const formatPercent = (value: number | undefined) =>
  value === undefined ? "N/A" : `${Math.round(value * 100)}%`;

export default function AIInsights({ analysis }: Props) {
  if (!analysis) return null;

  const keyword = analysis.keyword ?? "This technology";
  const stage = analysis.analysis?.stage ?? "Unknown";
  const github = formatNumber(analysis.github?.repo_count);
  const news = formatNumber(analysis.news?.article_count);
  const reddit = formatNumber(analysis.reddit?.post_count);
  const sentiment = formatPercent(analysis.sentiment?.positive);

  const generateInsight = () => {
    if (stage === "Innovation Trigger") {
      return `${keyword} is currently in the Innovation Trigger phase due to growing developer adoption (${github} repositories), emerging media attention (${news} articles), and early community discussion (${reddit} Reddit mentions).`;
    }

    if (stage === "Peak of Inflated Expectations") {
      return `${keyword} appears to be at Peak of Inflated Expectations with strong media hype, rapid community engagement, and aggressive early adoption signals.`;
    }

    if (stage === "Trough of Disillusionment") {
      return `${keyword} is entering a correction phase where expectations may have exceeded practical adoption, despite earlier hype momentum.`;
    }

    if (stage === "Slope of Enlightenment") {
      return `${keyword} shows maturing adoption patterns with improving practical value and more balanced market expectations.`;
    }

    return `${keyword} appears to have reached Plateau of Productivity with stable adoption and mainstream relevance.`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8"
    >
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-400/20 flex items-center justify-center">
          <Brain className="text-pink-300 w-8 h-8" />
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-3">AI Strategic Insight</h3>

          <p className="text-gray-300 leading-relaxed text-lg">
            {generateInsight()}
          </p>

          <div className="flex gap-4 mt-6 flex-wrap">
            <Badge label={`Sentiment ${sentiment}`} />
            <Badge label={stage} />
            <Badge label={`${github} GitHub repos`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
      {label}
    </span>
  );
}
