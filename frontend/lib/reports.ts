import type { AnalysisResponse, GeneratedReport } from "./types";

const STORAGE_KEY = "hype_cycle_reports";

const isBrowser = () => typeof window !== "undefined";

export function getReports(): GeneratedReport[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const reports = JSON.parse(raw);
    return Array.isArray(reports) ? reports : [];
  } catch {
    return [];
  }
}

export function saveReport(report: GeneratedReport) {
  if (!isBrowser()) return;

  const reports = getReports();
  const withoutExisting = reports.filter((item) => item.id !== report.id);
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([report, ...withoutExisting])
  );
}

export function getReport(id: string): GeneratedReport | null {
  return getReports().find((report) => report.id === id) ?? null;
}

export function deleteReport(id: string) {
  if (!isBrowser()) return;

  const reports = getReports().filter((report) => report.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function createReportFromAnalysis(analysis: AnalysisResponse): GeneratedReport {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    keyword: analysis.keyword,
    createdAt: new Date().toISOString(),
    stage: analysis.analysis.stage,
    hypeScore: analysis.analysis.hype_score,
    confidence: analysis.analysis.confidence,
    github: analysis.github,
    news: analysis.news,
    reddit: analysis.reddit,
    sentiment: analysis.sentiment,
    trends: analysis.trends,
  };
}
