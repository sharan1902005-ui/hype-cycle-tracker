import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")
load_dotenv()


GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")


def env_status() -> dict[str, bool]:
    return {
        "GITHUB_TOKEN": bool(GITHUB_TOKEN),
        "NEWS_API_KEY": bool(NEWS_API_KEY),
        "REDDIT_CLIENT_ID": bool(REDDIT_CLIENT_ID),
        "REDDIT_CLIENT_SECRET": bool(REDDIT_CLIENT_SECRET),
    }
