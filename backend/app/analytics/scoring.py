def calculate_hype_stage(
    github_score,
    news_count,
    reddit_engagement,
    trend_score,
    sentiment
):
    # Normalize signals
    github_norm = min(github_score / 50, 1)
    news_norm = min(news_count / 20, 1)
    reddit_norm = min(reddit_engagement / 10000, 1)
    trend_norm = min(trend_score / 100, 1)

    positive = sentiment.get("positive", 0)
    negative = sentiment.get("negative", 0)

    hype_score = (
        github_norm * 0.20 +
        news_norm * 0.25 +
        reddit_norm * 0.20 +
        trend_norm * 0.20 +
        positive * 0.15
    )

    if trend_norm > 0.8 and positive > 0.6 and github_norm < 0.5:
        stage = "Peak of Inflated Expectations"

    elif negative > 0.5 and trend_norm < 0.4:
        stage = "Trough of Disillusionment"

    elif github_norm > 0.7 and trend_norm < 0.6:
        stage = "Plateau of Productivity"

    elif github_norm > 0.5 and positive > 0.4:
        stage = "Slope of Enlightenment"

    else:
        stage = "Innovation Trigger"

    confidence = round(hype_score, 2)

    return {
        "stage": stage,
        "confidence": confidence,
        "hype_score": round(hype_score * 100, 2)
    }