from textblob import TextBlob

def analyze_sentiment(texts):
    if not texts:
        return {
            "positive": 0.33,
            "negative": 0.33,
            "neutral": 0.34
        }

    positive = 0
    negative = 0
    neutral = 0

    for text in texts:
        polarity = TextBlob(text).sentiment.polarity

        if polarity > 0.1:
            positive += 1
        elif polarity < -0.1:
            negative += 1
        else:
            neutral += 1

    total = len(texts)

    return {
        "positive": round(positive / total, 2),
        "negative": round(negative / total, 2),
        "neutral": round(neutral / total, 2)
    }
