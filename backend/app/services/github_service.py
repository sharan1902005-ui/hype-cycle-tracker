import os
import requests
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")


def get_github_data(keyword: str):
    try:
        headers = {"Accept": "application/vnd.github+json"}
        if GITHUB_TOKEN:
            headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

        # Search repositories
        search_url = "https://api.github.com/search/repositories"
        params = {"q": keyword, "sort": "stars", "order": "desc", "per_page": 10}
        res = requests.get(search_url, headers=headers, params=params, timeout=15)
        res.raise_for_status()
        data = res.json()

        repo_count = data.get("total_count", 0)
        items = data.get("items", [])

        total_stars = sum(r.get("stargazers_count", 0) for r in items)
        total_forks = sum(r.get("forks_count", 0) for r in items)

        # Adoption score: weighted blend of repo count, stars, forks (0-100)
        repo_norm  = min(repo_count / 50000, 1) * 40
        star_norm  = min(total_stars / 500000, 1) * 40
        fork_norm  = min(total_forks / 100000, 1) * 20
        adoption_score = round(repo_norm + star_norm + fork_norm, 2)

        return {
            "keyword": keyword,
            "repo_count": repo_count,
            "total_stars": total_stars,
            "total_forks": total_forks,
            "adoption_score": adoption_score,
            "source": "github_live",
        }

    except Exception as e:
        print("GitHub Error:", str(e))
        return {
            "keyword": keyword,
            "repo_count": 0,
            "total_stars": 0,
            "total_forks": 0,
            "adoption_score": 0,
            "source": "github_error",
        }
