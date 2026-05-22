"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  );
  const [name, setName] = useState("JD");
  const [email, setEmail] = useState("jd@example.com");

  return (
    <div className="min-h-screen bg-[#040816] text-white flex">
      <Sidebar active="Settings" />

      <main className="flex-1 px-10 py-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400 mb-8">Manage your account and preferences</p>

        <div className="max-w-xl space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold mb-4">Backend API</h2>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">API URL</label>
              <input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold">
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}
