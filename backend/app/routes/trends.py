from fastapi import APIRouter
from app.services.trends_service import get_trends_data

router = APIRouter()

@router.get("/trends/{keyword}")
def trends_analysis(keyword: str):
    return get_trends_data(keyword)