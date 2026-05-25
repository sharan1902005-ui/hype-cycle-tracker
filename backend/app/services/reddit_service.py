import requests
from bs4 import BeautifulSoup


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    )
}


def fetch_reddit_data(keyword: str):
    try:
        url = f"https://www.reddit.com/search/?q={keyword}"

        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text().lower()

        post_mentions = text.count("comments")
        upvote_mentions = text.count("upvote")
        engagement = post_mentions * 5 + upvote_mentions * 3

        sample_posts = []
        for line in text.split("\n"):
            line = line.strip()
            if keyword.lower() in line and len(line) > 20 and len(sample_posts) < 5:
                sample_posts.append(line[:120])

        return {
            "keyword": keyword,
            "post_count": max(post_mentions, 0),
            "engagement": engagement,
            "sample_posts": sample_posts,
            "source": "reddit_live",
        }

    except Exception as e:
        print("Reddit Error:", str(e))
        return {
            "keyword": keyword,
            "post_count": 0,
            "engagement": 0,
            "sample_posts": [],
            "source": "reddit_error",
            "error": str(e),
        }
