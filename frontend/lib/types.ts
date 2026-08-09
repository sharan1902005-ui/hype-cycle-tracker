export interface AnalysisResponse {
  keyword: string;
  analysis: {
    stage: string;
    confidence: number;
    hype_score: number;
  };
  github?: {
    repo_count: number;
    total_stars: number;
    total_forks: number;
    adoption_score: number;
    error?: string;
  };
  news?: {
    article_count: number;
    headlines?: string[];
    error?: string;
  };
  reddit?: {
    post_count: number;
    engagement: number;
    sample_posts?: string[];
    error?: string;
  };
  sentiment?: {
    positive: number;
    negative: number;
    neutral: number;
    error?: string;
  };
  trends?: {
    trend_points: number[];
    source: string;
    error?: string;
  };
}

export interface GeneratedReport {
  id: string;
  keyword: string;
  createdAt: string;
  stage: string;
  hypeScore: number;
  confidence: number;
  github?: AnalysisResponse["github"];
  news?: AnalysisResponse["news"];
  reddit?: AnalysisResponse["reddit"];
  sentiment?: AnalysisResponse["sentiment"];
  trends?: AnalysisResponse["trends"];
}
