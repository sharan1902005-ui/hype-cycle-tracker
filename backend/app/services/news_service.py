import os
import requests
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def get_news_data(keyword: str):
    url = "https://newsapi.org/v2/everything"

    params = {
        "q": keyword,
        "apiKey": NEWS_API_KEY,
        "language": "en",
        "pageSize": 10
    }

    response = requests.get(url, params=params)
    data = response.json()

    articles = data.get("articles", [])

    headlines = [article["title"] for article in articles]

    return {
        "keyword": keyword,
        "article_count": len(articles),
        "headlines": headlines
    }