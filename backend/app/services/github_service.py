import requests

from app.config import GITHUB_TOKEN


GITHUB_SEARCH_URL = "https://api.github.com/search/repositories"
REQUEST_TIMEOUT = 15


def _response_preview(response: requests.Response, limit: int = 500) -> str:
    return response.text[:limit].replace("\n", " ")


def get_github_data(keyword: str) -> dict:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "hype-cycle-tracker/1.0",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    else:
        print("GitHub Config Warning: GITHUB_TOKEN is not set")

    params = {
        "q": keyword,
        "sort": "stars",
        "order": "desc",
        "per_page": 10,
    }

    try:
        print("GitHub Request URL:", GITHUB_SEARCH_URL)
        response = requests.get(
            GITHUB_SEARCH_URL,
            headers=headers,
            params=params,
            timeout=REQUEST_TIMEOUT,
        )
        print("GitHub Final URL:", response.url)
        print("GitHub Status Code:", response.status_code)
        print("GitHub Response:", _response_preview(response))

        if response.status_code != 200:
            return {
                "keyword": keyword,
                "error": f"GitHub API returned {response.status_code}",
                "details": _response_preview(response),
                "source": "github_error",
            }

        data = response.json()
        repo_count = data.get("total_count", 0)
        items = data.get("items", [])

        total_stars = sum(repo.get("stargazers_count", 0) for repo in items)
        total_forks = sum(repo.get("forks_count", 0) for repo in items)

        repo_norm = min(repo_count / 50000, 1) * 40
        star_norm = min(total_stars / 500000, 1) * 40
        fork_norm = min(total_forks / 100000, 1) * 20
        adoption_score = round(repo_norm + star_norm + fork_norm, 2)

        return {
            "keyword": keyword,
            "repo_count": repo_count,
            "total_stars": total_stars,
            "total_forks": total_forks,
            "adoption_score": adoption_score,
            "activity_score": adoption_score,
            "source": "github_live",
        }

    except requests.RequestException as exc:
        print("GitHub API Error:", str(exc))
        return {
            "keyword": keyword,
            "error": str(exc),
            "source": "github_error",
        }
    except Exception as exc:
        print("GitHub Unexpected Error:", str(exc))
        return {
            "keyword": keyword,
            "error": str(exc),
            "source": "github_error",
        }
