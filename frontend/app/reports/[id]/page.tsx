"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Cpu,
  MessageCircle,
  Newspaper,
  Trash2,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Sidebar from "@/app/components/Sidebar";
import { deleteReport, getReport } from "@/lib/reports";
import type { GeneratedReport } from "@/lib/types";

const formatNumber = (value: number | null | undefined) =>
  value === undefined || value === null ? "N/A" : value.toLocaleString();

const formatPercent = (value: number | null | undefined) =>
  value === undefined || value === null ? "N/A" : `${Math.round(value * 100)}%`;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const sentimentPercent = (value: number | undefined) =>
  value === undefined ? "N/A" : `${Math.round(value * 100)}%`;

function buildSummary(report: GeneratedReport) {
  const parts = [
    `${report.keyword} is classified as ${report.stage} with a hype score of ${report.hypeScore} and ${formatPercent(report.confidence)} confidence.`,
  ];

  if (report.github?.error) {
    parts.push("GitHub data is unavailable for this report.");
  } else if (report.github) {
    parts.push(
      `Developer adoption shows ${formatNumber(report.github.repo_count)} repositories, ${formatNumber(report.github.total_stars)} stars, and ${formatNumber(report.github.total_forks)} forks.`
    );
  }

  if (report.news?.error) {
    parts.push("News data is unavailable.");
  } else if (report.news) {
    parts.push(`Media buzz includes ${formatNumber(report.news.article_count)} articles.`);
  }

  if (report.reddit?.error) {
    parts.push("Community data is unavailable.");
  } else if (report.reddit) {
    parts.push(
      `Community activity includes ${formatNumber(report.reddit.post_count)} posts with ${formatNumber(report.reddit.engagement)} engagement.`
    );
  }

  return parts.join(" ");
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setReport(getReport(params.id));
      setLoaded(true);
    });
  }, [params.id]);

  const trendData = useMemo(
    () =>
      report?.trends?.trend_points?.map((value, index) => ({
        period: `P${index + 1}`,
        value,
      })) ?? [],
    [report]
  );

  const removeReport = () => {
    if (!report) return;
    deleteReport(report.id);
    router.push("/reports");
  };

  if (!loaded) return null;

  if (!report) {
    return (
      <div className="min-h-screen bg-[#040816] text-white flex">
        <Sidebar active="Reports" />
        <main className="flex-1 px-4 md:px-10 py-8">
          <Link href="/reports" className="inline-flex items-center gap-2 text-cyan-300 mb-8">
            <ArrowLeft size={18} />
            Reports
          </Link>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-400">
            Report not found.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040816] text-white flex">
      <Sidebar active="Reports" />

      <main className="flex-1 px-4 md:px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <Link href="/reports" className="inline-flex items-center gap-2 text-cyan-300">
            <ArrowLeft size={18} />
            Reports
          </Link>
          <button
            onClick={removeReport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-pink-400/30 bg-pink-500/10 text-pink-200 text-sm hover:bg-pink-500/20 transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1025] to-[#060b1a] p-8 mb-6">
          <p className="text-cyan-300 mb-3">Technology Intelligence Report</p>
          <h1 className="text-4xl md:text-5xl font-bold capitalize mb-6">{report.keyword}</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Metric label="Stage" value={report.stage} />
            <Metric label="Hype Score" value={report.hypeScore} />
            <Metric label="Confidence" value={formatPercent(report.confidence)} />
            <Metric label="Created" value={formatDate(report.createdAt)} />
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <ReportCard title="Developer Adoption" icon={<Cpu className="text-cyan-300" />}>
            {report.github?.error ? (
              <Unavailable message="GitHub data unavailable" />
            ) : (
              <>
                <Metric label="Repositories" value={formatNumber(report.github?.repo_count)} />
                <Metric label="Stars" value={formatNumber(report.github?.total_stars)} />
                <Metric label="Forks" value={formatNumber(report.github?.total_forks)} />
              </>
            )}
          </ReportCard>

          <ReportCard title="Media Buzz" icon={<Newspaper className="text-purple-300" />}>
            {report.news?.error ? (
              <Unavailable message="News data unavailable" />
            ) : (
              <Metric label="Articles" value={formatNumber(report.news?.article_count)} />
            )}
          </ReportCard>

          <ReportCard title="Community Activity" icon={<MessageCircle className="text-pink-300" />}>
            {report.reddit?.error ? (
              <Unavailable message="Community data unavailable" />
            ) : (
              <>
                <Metric label="Posts" value={formatNumber(report.reddit?.post_count)} />
                <Metric label="Engagement" value={formatNumber(report.reddit?.engagement)} />
              </>
            )}
          </ReportCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <ReportCard title="AI Sentiment" icon={<BarChart3 className="text-cyan-300" />}>
            {report.sentiment?.error || !report.sentiment ? (
              <Unavailable message="No sentiment data available" />
            ) : (
              <>
                <Metric label="Positive" value={sentimentPercent(report.sentiment.positive)} />
                <Metric label="Neutral" value={sentimentPercent(report.sentiment.neutral)} />
                <Metric label="Negative" value={sentimentPercent(report.sentiment.negative)} />
              </>
            )}
          </ReportCard>

          <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold mb-6">Trend Momentum</h2>
            {trendData.length ? (
              <div className="w-full min-w-0 h-[320px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
                  <LineChart data={trendData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="period" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      formatter={(value) => [
                        typeof value === "number" ? value.toFixed(1) : value,
                        "Trend Score",
                      ]}
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "16px",
                        color: "#fff",
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={4} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Unavailable message="Trend data unavailable" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <ReportCard title="Key News">
            {report.news?.headlines?.length ? (
              <ul className="space-y-3 text-gray-300">
                {report.news.headlines.map((headline, index) => (
                  <li key={`${headline}-${index}`} className="rounded-2xl bg-black/20 border border-white/10 p-4">
                    {headline}
                  </li>
                ))}
              </ul>
            ) : (
              <Unavailable message="No news headlines available" />
            )}
          </ReportCard>

          <ReportCard title="Community Signals">
            {report.reddit?.sample_posts?.length ? (
              <ul className="space-y-3 text-gray-300">
                {report.reddit.sample_posts.map((post, index) => (
                  <li key={`${post}-${index}`} className="rounded-2xl bg-black/20 border border-white/10 p-4">
                    {post}
                  </li>
                ))}
              </ul>
            ) : (
              <Unavailable message="No Reddit sample posts available" />
            )}
          </ReportCard>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold mb-4">AI Summary</h2>
          <p className="text-gray-300 leading-relaxed">{buildSummary(report)}</p>
        </section>
      </main>
    </div>
  );
}

function ReportCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3 mb-5">
        {icon && (
          <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center">
            {icon}
          </div>
        )}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function Unavailable({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-gray-400">
      {message}
    </div>
  );
}
