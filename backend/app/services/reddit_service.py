import requests

from app.config import REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET


REDDIT_TOKEN_URL = "https://www.reddit.com/api/v1/access_token"
REDDIT_OAUTH_SEARCH_URL = "https://oauth.reddit.com/search"
REDDIT_JSON_SEARCH_URL = "https://www.reddit.com/search.json"
REQUEST_TIMEOUT = 15

BASE_HEADERS = {
    "User-Agent": "hype-cycle-tracker/1.0 by sharan1902005-ui",
    "Accept": "application/json",
}


def _response_preview(response: requests.Response, limit: int = 500) -> str:
    return response.text[:limit].replace("\n", " ")


def _parse_posts(keyword: str, payload: dict, source: str) -> dict:
    reddit_data = payload.get("data", {})
    posts = reddit_data.get("children", [])

    post_count = reddit_data.get("dist")
    if post_count is None:
        post_count = len(posts)

    engagement = sum(
        post.get("data", {}).get("score", 0)
        + post.get("data", {}).get("num_comments", 0)
        for post in posts
    )

    sample_posts = [
        post.get("data", {}).get("title", "")
        for post in posts[:8]
        if post.get("data", {}).get("title")
    ]

    return {
        "keyword": keyword,
        "post_count": post_count,
        "engagement": engagement,
        "sample_posts": sample_posts,
        "titles": sample_posts,
        "source": source,
    }


def _get_access_token() -> str | None:
    if not REDDIT_CLIENT_ID or not REDDIT_CLIENT_SECRET:
        print("Reddit Config Warning: REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET are not set")
        return None

    response = requests.post(
        REDDIT_TOKEN_URL,
        auth=(REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET),
        data={"grant_type": "client_credentials"},
        headers=BASE_HEADERS,
        timeout=REQUEST_TIMEOUT,
    )
    print("Reddit Token Status Code:", response.status_code)

    if response.status_code != 200:
        print("Reddit Token Response:", _response_preview(response))
        return None

    return response.json().get("access_token")


def _search_with_oauth(keyword: str, token: str) -> dict:
    headers = {
        **BASE_HEADERS,
        "Authorization": f"Bearer {token}",
    }
    params = {
        "q": keyword,
        "sort": "relevance",
        "limit": 25,
        "type": "link",
    }

    print("Reddit Request URL:", REDDIT_OAUTH_SEARCH_URL)
    response = requests.get(
        REDDIT_OAUTH_SEARCH_URL,
        headers=headers,
        params=params,
        timeout=REQUEST_TIMEOUT,
    )
    print("Reddit Final URL:", response.url)
    print("Reddit Status Code:", response.status_code)
    print("Reddit Response:", _response_preview(response))

    if response.status_code != 200:
        return {
            "keyword": keyword,
            "error": f"Reddit API returned {response.status_code}",
            "details": _response_preview(response),
            "source": "reddit_error",
        }

    return _parse_posts(keyword, response.json(), "reddit_oauth_live")


def _search_with_json_endpoint(keyword: str) -> dict:
    params = {
        "q": keyword,
        "sort": "relevance",
        "limit": 25,
        "type": "link",
    }

    print("Reddit Request URL:", REDDIT_JSON_SEARCH_URL)
    response = requests.get(
        REDDIT_JSON_SEARCH_URL,
        headers=BASE_HEADERS,
        params=params,
        timeout=REQUEST_TIMEOUT,
    )
    print("Reddit Final URL:", response.url)
    print("Reddit Status Code:", response.status_code)
    print("Reddit Response:", _response_preview(response))

    if response.status_code != 200:
        return {
            "keyword": keyword,
            "error": f"Reddit API returned {response.status_code}",
            "details": _response_preview(response),
            "source": "reddit_error",
        }

    return _parse_posts(keyword, response.json(), "reddit_json_live")


def fetch_reddit_data(keyword: str) -> dict:
    try:
        token = _get_access_token()
        if not token:
            return {
                "keyword": keyword,
                "post_count": 0,
                "engagement": 0,
                "sample_posts": [],
                "titles": [],
                "error": "Reddit credentials missing. Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET.",
                "source": "reddit_config_error",
            }

        if token:
            oauth_result = _search_with_oauth(keyword, token)
            if "error" not in oauth_result:
                return oauth_result
            print("Reddit OAuth Error:", oauth_result["error"])

        return _search_with_json_endpoint(keyword)

    except requests.RequestException as exc:
        print("Reddit API Error:", str(exc))
        return {
            "keyword": keyword,
            "error": str(exc),
            "source": "reddit_error",
        }
    except Exception as exc:
        print("Reddit Unexpected Error:", str(exc))
        return {
            "keyword": keyword,
            "error": str(exc),
            "source": "reddit_error",
        }


def get_reddit_data(keyword: str) -> dict:
    return fetch_reddit_data(keyword)
