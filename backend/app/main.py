from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.health import router as health_router
from app.routes.github import router as github_router
from app.routes.news import router as news_router
from app.routes.reddit import router as reddit_router
from app.routes.trends import router as trends_router
from app.routes.sentiment import router as sentiment_router
from app.routes.scoring import router as scoring_router
from app.routes.analyze import router as analyze_router
from app.db.database import engine
from app.cache.redis_client import redis_client

app = FastAPI(title="Hype Cycle Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(github_router)
app.include_router(news_router)
app.include_router(reddit_router)
app.include_router(trends_router)
app.include_router(sentiment_router)
app.include_router(scoring_router)
app.include_router(analyze_router)

@app.get("/")
def root():
    return {"message": "Hype Cycle Tracker Backend Running"}

@app.get("/test-connections")
def test_connections():
    return {
        "database": "configured",
        "redis": "configured"
    }