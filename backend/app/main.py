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


def calculate_hype_stage(score):
    if score <= 20:
        return "Innovation Trigger"
    elif score <= 40:
        return "Peak of Inflated Expectations"
    elif score <= 60:
        return "Trough of Disillusionment"
    elif score <= 80:
        return "Slope of Enlightenment"
    return "Plateau of Productivity"


@app.get("/")
def home():
    return {"message": "Hype Cycle Tracker API running"}


@app.get("/analyze/{keyword}")
def analyze(keyword: str):
    github = get_github_data(keyword)
    news = fetch_news_data(keyword)
    reddit = fetch_reddit_data(keyword)

    sentiment_texts = []
    sentiment_texts.extend(news.get("headlines", []))
    sentiment_texts.extend(reddit.get("sample_posts", []))

    sentiment = analyze_sentiment(sentiment_texts)

    github_score = min(github.get("repo_count", 0) / 5000, 30)
    news_score = min(news.get("article_count", 0) * 2, 25)
    reddit_score = min(reddit.get("post_count", 0), 20)
    sentiment_score = sentiment.get("positive", 0) * 25

    total_score = round(github_score + news_score + reddit_score + sentiment_score)
    confidence = round(total_score / 100, 2)

    trend_points = [
        max(total_score - 20, 5),
        max(total_score - 12, 10),
        max(total_score - 8, 15),
        max(total_score - 4, 20),
        total_score,
        min(total_score + 5, 100),
    ]

    return {
        "keyword": keyword,
        "analysis": {
            "stage": calculate_hype_stage(total_score),
            "confidence": confidence,
            "hype_score": total_score,
        },
        "github": github,
        "news": news,
        "reddit": reddit,
        "sentiment": sentiment,
        "trends": {
            "trend_points": trend_points,
            "source": "live",
        },
    }
