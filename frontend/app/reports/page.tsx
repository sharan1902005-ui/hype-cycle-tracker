"use client";

import Sidebar from "../components/Sidebar";

const reports = [
  { title: "AI Hype Analysis Q2 2025", date: "May 2025", stage: "Peak of Inflated Expectations" },
  { title: "Blockchain Recovery Report", date: "Apr 2025", stage: "Trough of Disillusionment" },
  { title: "Quantum Computing Outlook", date: "Mar 2025", stage: "Innovation Trigger" },
  { title: "LLM Market Intelligence", date: "Feb 2025", stage: "Peak of Inflated Expectations" },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#040816] text-white flex">
      <Sidebar active="Reports" />

      <main className="flex-1 px-10 py-8">
        <h1 className="text-4xl font-bold mb-2">Reports</h1>
        <p className="text-gray-400 mb-8">Generated hype cycle intelligence reports</p>

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.title}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5 hover:bg-white/10 transition cursor-pointer"
            >
              <div>
                <h3 className="font-semibold text-lg">{report.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{report.date} · {report.stage}</p>
              </div>
              <button className="px-5 py-2 rounded-xl border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition">
                View
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
