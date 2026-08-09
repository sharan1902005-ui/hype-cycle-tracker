from fastapi import APIRouter
from app.cache.memory_cache import analysis_cache
from app.services.github_service import get_github_data
from app.services.news_service import get_news_data
from app.services.reddit_service import get_reddit_data
from app.services.trends_service import get_trends_data
from app.nlp.sentiment import analyze_sentiment
from app.analytics.scoring import calculate_hype_stage

router = APIRouter()


def _normalize_github_data(keyword: str, data: dict) -> dict:
    if "error" in data:
        return {
            **data,
            "keyword": keyword,
            "repo_count": data.get("repo_count", 0),
            "total_stars": data.get("total_stars", 0),
            "total_forks": data.get("total_forks", 0),
            "adoption_score": data.get("adoption_score", 0),
            "activity_score": data.get("activity_score", 0),
        }

    return data


def _normalize_news_data(keyword: str, data: dict) -> dict:
    if "error" in data or data.get("source") == "news_error":
        return {
            **data,
            "keyword": keyword,
            "article_count": data.get("article_count", 0),
            "headlines": data.get("headlines", []),
            "error": data.get("error") or "News API unavailable",
        }

    return data


def _normalize_reddit_data(keyword: str, data: dict) -> dict:
    if "error" in data:
        return {
            **data,
            "keyword": keyword,
            "post_count": data.get("post_count", 0),
            "engagement": data.get("engagement", 0),
            "sample_posts": data.get("sample_posts", []),
            "titles": data.get("titles", []),
        }

    return data


@router.get("/analyze/{keyword}")
def analyze_keyword(keyword: str):
    cache_key = keyword.lower()

    if cache_key in analysis_cache:
        cached_result = dict(analysis_cache[cache_key])   # copy
        cached_result["source"] = "cache"
        return cached_result

    try:
        github_data = _normalize_github_data(keyword, get_github_data(keyword))
        news_data = _normalize_news_data(keyword, get_news_data(keyword))
        reddit_data = _normalize_reddit_data(keyword, get_reddit_data(keyword))
        trends_data = get_trends_data(keyword)

        combined_texts = []
        combined_texts.extend(news_data.get("headlines", []))
        combined_texts.extend(reddit_data.get("titles", []))

        sentiment = analyze_sentiment(combined_texts)

        analysis = calculate_hype_stage(
            github_score=github_data["activity_score"],
            news_count=news_data["article_count"],
            reddit_engagement=reddit_data["engagement"],
            trend_score=trends_data["average_interest"],
            sentiment=sentiment
        )

        result = {
            "keyword": keyword,
            "github": github_data,
            "news": news_data,
            "reddit": reddit_data,
            "trends": trends_data,
            "sentiment": sentiment,
            "analysis": analysis
        }

        analysis_cache[cache_key] = result

        live_result = dict(result)
        live_result["source"] = "live"

        return live_result

    except Exception as e:
        print("Analyze Route Error:", str(e))
        if cache_key in analysis_cache:
            fallback = dict(analysis_cache[cache_key])
            fallback["source"] = "fallback_cache"
            return fallback

        return {"error": str(e), "source": "analysis_error"}

@router.get("/warm-cache")
def warm_cache():
    demo_keywords = [
        "artificial intelligence",
        "blockchain",
        "web3",
        "metaverse",
        "quantum computing",
        "llm",
        "ai agents"
    ]

    warmed = []

    for keyword in demo_keywords:
        analyze_keyword(keyword)
        warmed.append(keyword)

    return {
        "message": "Cache warmed successfully",
        "keywords": warmed
    }
