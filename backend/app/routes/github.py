from fastapi import APIRouter
from app.services.github_service import get_github_data

router = APIRouter()

@router.get("/github/{keyword}")
def github_analysis(keyword: str):
    return get_github_data(keyword)