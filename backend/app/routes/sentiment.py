from fastapi import APIRouter
from app.nlp.sentiment import analyze_sentiment

router = APIRouter()

@router.get("/sentiment/test")
def sentiment_test():
    sample_texts = [
        "AI is revolutionary and changing the world",
        "This technology is overhyped and disappointing",
        "Large language models are becoming common tools"
    ]

    return analyze_sentiment(sample_texts)