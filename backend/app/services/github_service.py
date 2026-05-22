import os
from dotenv import load_dotenv
from github import Github

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

g = Github(GITHUB_TOKEN)

def get_github_data(keyword: str):
    try:
        repos = g.search_repositories(query=keyword)

        repo_count = repos.totalCount
        total_stars = 0

        for repo in repos[:10]:
            total_stars += repo.stargazers_count

        activity_score = total_stars / 10000 if total_stars > 0 else 0

        return {
            "keyword": keyword,
            "repo_count": repo_count,
            "total_stars_top10": total_stars,
            "activity_score": round(activity_score, 2)
        }

    except Exception:
        return {
            "keyword": keyword,
            "repo_count": 0,
            "total_stars_top10": 0,
            "activity_score": 0
        }