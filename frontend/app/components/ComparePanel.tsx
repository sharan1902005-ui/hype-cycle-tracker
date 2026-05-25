"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Cpu,
  Newspaper,
  MessageCircle,
  Brain,
} from "lucide-react";

type CompareData = {
  name: string;
  github: number;
  news: number;
  reddit: number;
  sentiment: number;
  stage: string;
};

type Props = {
  compareData: CompareData[];
};

export default function ComparePanel({ compareData }: Props) {
  if (!compareData?.length) return null;

  const maxGithub = Math.max(...compareData.map((x) => x.github), 1);
  const maxNews = Math.max(...compareData.map((x) => x.news), 1);
  const maxReddit = Math.max(...compareData.map((x) => x.reddit), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
          <BarChart3 className="text-cyan-300 w-8 h-8" />
        </div>

        <div>
          <h3 className="text-2xl font-bold">Technology Comparison</h3>
          <p className="text-gray-400">Compare hype signals across technologies</p>
        </div>
      </div>

      <div className="space-y-8">
        {compareData.map((tech) => (
          <div key={tech.name} className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-xl font-bold capitalize">{tech.name}</h4>
                <p className="text-cyan-300 text-sm">{tech.stage}</p>
              </div>

              <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                {tech.sentiment}% Positive
              </span>
            </div>

            <MetricBar label="GitHub" value={tech.github} max={maxGithub} icon={<Cpu size={18} />} />
            <MetricBar label="News" value={tech.news} max={maxNews} icon={<Newspaper size={18} />} />
            <MetricBar label="Reddit" value={tech.reddit} max={maxReddit} icon={<MessageCircle size={18} />} />
            <MetricBar label="Sentiment" value={tech.sentiment} max={100} icon={<Brain size={18} />} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MetricBar({
  label,
  value,
  max,
  icon,
}: {
  label: string;
  value: number;
  max: number;
  icon: React.ReactNode;
}) {
  const width = (value / max) * 100;

  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-300">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-gray-400">{value.toLocaleString()}</span>
      </div>

      <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
