import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json",
}


def fetch_reddit_data(keyword: str):
    try:
        url = f"https://www.reddit.com/search.json?q={keyword}&sort=relevance&limit=25&type=link"
        res = requests.get(url, headers=HEADERS, timeout=15)
        res.raise_for_status()

        data = res.json()
        reddit_data = data.get("data", {})
        posts = reddit_data.get("children", [])

        # Use dist (total returned) or len(posts)
        post_count = reddit_data.get("dist", len(posts))

        engagement = sum(
            p["data"].get("score", 0) + p["data"].get("num_comments", 0)
            for p in posts
        )

        sample_posts = [
            p["data"].get("title", "")
            for p in posts[:8]
            if p["data"].get("title")
        ]

        return {
            "keyword": keyword,
            "post_count": post_count,
            "engagement": engagement,
            "sample_posts": sample_posts,
            "source": "reddit_live",
        }

    except Exception as e:
        print("Reddit Error:", str(e))

        # Fallback: try alternative endpoint
        try:
            url2 = f"https://www.reddit.com/search.json?q={keyword}&limit=10"
            res2 = requests.get(url2, headers=HEADERS, timeout=10)
            data2 = res2.json()
            posts2 = data2.get("data", {}).get("children", [])
            return {
                "keyword": keyword,
                "post_count": len(posts2),
                "engagement": sum(p["data"].get("score", 0) for p in posts2),
                "sample_posts": [p["data"].get("title", "") for p in posts2[:5]],
                "source": "reddit_fallback",
            }
        except Exception:
            return {
                "keyword": keyword,
                "post_count": 0,
                "engagement": 0,
                "sample_posts": [],
                "source": "reddit_error",
            }
