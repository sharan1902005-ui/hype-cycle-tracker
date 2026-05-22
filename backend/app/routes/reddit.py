from fastapi import APIRouter
from app.services.reddit_service import get_reddit_data

router = APIRouter()

@router.get("/reddit/{keyword}")
def reddit_analysis(keyword: str):
    return get_reddit_data(keyword)