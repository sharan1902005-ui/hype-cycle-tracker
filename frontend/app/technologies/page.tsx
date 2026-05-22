"use client";

import Sidebar from "../components/Sidebar";

const technologies = [
  { name: "Artificial Intelligence", stage: "Peak of Inflated Expectations", score: 85 },
  { name: "Blockchain", stage: "Trough of Disillusionment", score: 42 },
  { name: "Quantum Computing", stage: "Innovation Trigger", score: 18 },
  { name: "Web3", stage: "Trough of Disillusionment", score: 38 },
  { name: "Metaverse", stage: "Trough of Disillusionment", score: 30 },
  { name: "LLM", stage: "Peak of Inflated Expectations", score: 90 },
  { name: "AI Agents", stage: "Innovation Trigger", score: 22 },
  { name: "Edge Computing", stage: "Slope of Enlightenment", score: 68 },
];

const stageColor: Record<string, string> = {
  "Innovation Trigger": "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  "Peak of Inflated Expectations": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "Trough of Disillusionment": "text-red-400 bg-red-400/10 border-red-400/20",
  "Slope of Enlightenment": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "Plateau of Productivity": "text-green-400 bg-green-400/10 border-green-400/20",
};

export default function TechnologiesPage() {
  return (
    <div className="min-h-screen bg-[#040816] text-white flex">
      <Sidebar active="Technologies" />

      <main className="flex-1 px-10 py-8">
        <h1 className="text-4xl font-bold mb-2">Technologies</h1>
        <p className="text-gray-400 mb-8">Tracked technologies and their hype cycle positions</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <h3 className="text-xl font-bold mb-3">{tech.name}</h3>

              <span className={`text-sm px-3 py-1 rounded-full border ${stageColor[tech.stage]}`}>
                {tech.stage}
              </span>

              <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  style={{ width: `${tech.score}%` }}
                />
              </div>

              <p className="text-sm text-gray-500 mt-2">Hype score: {tech.score}%</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
