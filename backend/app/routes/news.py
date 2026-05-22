from fastapi import APIRouter
from app.services.news_service import get_news_data

router = APIRouter()

@router.get("/news/{keyword}")
def news_analysis(keyword: str):
    return get_news_data(keyword)