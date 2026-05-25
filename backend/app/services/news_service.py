import os
import requests
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")


def fetch_news_data(keyword: str):
    try:
        if not NEWS_API_KEY:
            raise Exception("NEWS_API_KEY missing")

        url = "https://gnews.io/api/v4/search"

        params = {
            "q": keyword,
            "lang": "en",
            "country": "us",
            "max": 10,
            "apikey": NEWS_API_KEY,
        }

        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()

        data = response.json()
        articles = data.get("articles", [])
        headlines = [article.get("title", "") for article in articles]

        sentiment_hint = 0
        positive_words = ["breakthrough", "innovation", "success", "growth", "advance"]

        for headline in headlines:
            lower = headline.lower()
            for word in positive_words:
                if word in lower:
                    sentiment_hint += 1

        return {
            "keyword": keyword,
            "article_count": len(articles),
            "headlines": headlines,
            "sentiment_hint": sentiment_hint,
            "source": "gnews_live",
        }

    except Exception as e:
        print("News API Error:", str(e))
        return {
            "keyword": keyword,
            "article_count": 0,
            "headlines": [],
            "sentiment_hint": 0,
            "source": "news_error",
            "error": str(e),
        }
