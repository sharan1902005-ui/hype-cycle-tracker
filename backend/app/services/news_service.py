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
            "max": 10,
            "apikey": NEWS_API_KEY,
        }

        res = requests.get(url, params=params, timeout=15)
        res.raise_for_status()
        data = res.json()

        articles = data.get("articles", [])
        headlines = [a.get("title", "") for a in articles if a.get("title")]

        return {
            "keyword": keyword,
            "article_count": len(articles),
            "headlines": headlines,
            "source": "gnews_live",
        }

    except Exception as e:
        print("News Error:", str(e))
        return {
            "keyword": keyword,
            "article_count": 0,
            "headlines": [],
            "source": "news_error",
        }
