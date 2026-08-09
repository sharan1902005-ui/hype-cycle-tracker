"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Eye, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { deleteReport, getReports } from "@/lib/reports";
import type { GeneratedReport } from "@/lib/types";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export default function ReportsPage() {
  const [reports, setReports] = useState<GeneratedReport[]>([]);

  useEffect(() => {
    queueMicrotask(() => setReports(getReports()));
  }, []);

  const removeReport = (id: string) => {
    deleteReport(id);
    setReports(getReports());
  };

  return (
    <div className="min-h-screen bg-[#040816] text-white flex">
      <Sidebar active="Reports" />

      <main className="flex-1 px-4 md:px-10 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
            <BarChart3 className="text-cyan-300" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Reports</h1>
            <p className="text-gray-400">Generated hype cycle intelligence reports</p>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-400">
            No generated reports yet. Analyze a technology on the Dashboard, then generate a report.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                  <div>
                    <h3 className="font-semibold text-2xl capitalize mb-3">
                      {report.keyword}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      <p className="text-gray-400">
                        Stage: <span className="text-cyan-300">{report.stage}</span>
                      </p>
                      <p className="text-gray-400">
                        Hype Score: <span className="text-white">{report.hypeScore}</span>
                      </p>
                      <p className="text-gray-400">
                        Confidence: <span className="text-white">{formatPercent(report.confidence)}</span>
                      </p>
                      <p className="text-gray-400">
                        Created: <span className="text-white">{formatDate(report.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/reports/${report.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 text-sm hover:bg-cyan-500/20 transition"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    <button
                      onClick={() => removeReport(report.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-pink-400/30 bg-pink-500/10 text-pink-200 text-sm hover:bg-pink-500/20 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
