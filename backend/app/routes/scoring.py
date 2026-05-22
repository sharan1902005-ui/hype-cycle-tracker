from fastapi import APIRouter
from app.analytics.scoring import calculate_hype_stage

router = APIRouter()

@router.get("/score/test")
def score_test():
    sample_sentiment = {
        "positive": 0.7,
        "negative": 0.1,
        "neutral": 0.2
    }

    return calculate_hype_stage(
        github_score=48,
        news_count=15,
        reddit_engagement=9000,
        trend_score=85,
        sentiment=sample_sentiment
    )