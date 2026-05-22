import requests

def get_reddit_data(keyword: str):
    url = f"https://www.reddit.com/search.json?q={keyword}&limit=10"

    headers = {
        "User-Agent": "HypeCycleTracker/1.0"
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    posts = data["data"]["children"]

    post_count = len(posts)

    total_score = 0
    total_comments = 0
    titles = []

    for post in posts:
        post_data = post["data"]
        total_score += post_data.get("score", 0)
        total_comments += post_data.get("num_comments", 0)
        titles.append(post_data.get("title", ""))

    engagement = total_score + total_comments

    return {
        "keyword": keyword,
        "post_count": post_count,
        "engagement": engagement,
        "titles": titles
    }