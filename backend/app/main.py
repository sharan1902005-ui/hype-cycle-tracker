from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.github_service import get_github_data
from app.services.news_service import fetch_news_data
from app.services.reddit_service import fetch_reddit_data
from app.nlp.sentiment import analyze_sentiment

app = FastAPI(title="Hype Cycle Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def calculate_hype_stage(score: float) -> str:
    if score < 20:
        return "Innovation Trigger"
    elif score < 40:
        return "Peak of Inflated Expectations"
    elif score < 55:
        return "Trough of Disillusionment"
    elif score < 75:
        return "Slope of Enlightenment"
    return "Plateau of Productivity"


@app.get("/")
def home():
    return {"message": "Hype Cycle Tracker API running"}


@app.get("/analyze/{keyword}")
def analyze(keyword: str):
    github = get_github_data(keyword)
    news   = fetch_news_data(keyword)
    reddit = fetch_reddit_data(keyword)

    # Sentiment from real text
    texts = news.get("headlines", []) + reddit.get("sample_posts", [])
    sentiment = analyze_sentiment(texts)

    # Weighted hype score (0-100)
    # GitHub adoption  35%
    github_component   = min(github.get("adoption_score", 0) / 100, 1) * 35

    # News buzz        20%
    news_component     = min(news.get("article_count", 0) / 10, 1) * 20

    # Community        20%
    reddit_component   = min(reddit.get("post_count", 0) / 25, 1) * 20

    # Sentiment        25%
    sentiment_component = sentiment.get("positive", 0) * 25

    hype_score = round(github_component + news_component + reddit_component + sentiment_component, 1)
    confidence = round(hype_score / 100, 2)

    # Trend points — simulate momentum curve
    trend_points = [
        round(max(hype_score * 0.4, 2), 1),
        round(max(hype_score * 0.55, 3), 1),
        round(max(hype_score * 0.7, 5), 1),
        round(max(hype_score * 0.82, 8), 1),
        round(max(hype_score * 0.91, 10), 1),
        round(hype_score, 1),
        round(min(hype_score * 1.05, 100), 1),
        round(min(hype_score * 1.08, 100), 1),
        round(min(hype_score * 1.06, 100), 1),
        round(min(hype_score * 1.03, 100), 1),
    ]

    return {
        "keyword": keyword,
        "analysis": {
            "stage":      calculate_hype_stage(hype_score),
            "confidence": confidence,
            "hype_score": hype_score,
        },
        "github": {
            "repo_count":     github.get("repo_count", 0),
            "total_stars":    github.get("total_stars", 0),
            "total_forks":    github.get("total_forks", 0),
            "adoption_score": github.get("adoption_score", 0),
        },
        "news": {
            "article_count": news.get("article_count", 0),
            "headlines":     news.get("headlines", []),
        },
        "reddit": {
            "post_count":   reddit.get("post_count", 0),
            "engagement":   reddit.get("engagement", 0),
            "sample_posts": reddit.get("sample_posts", []),
        },
        "sentiment": sentiment,
        "trends": {
            "trend_points": trend_points,
            "source": "computed",
        },
    }
