from pytrends.request import TrendReq

pytrends = TrendReq(hl='en-US', tz=330)

def get_trends_data(keyword: str):
    try:
        pytrends.build_payload([keyword], timeframe='today 12-m')

        data = pytrends.interest_over_time()

        if data.empty:
            return {
                "keyword": keyword,
                "average_interest": 0,
                "peak_interest": 0,
                "trend_points": [],
                "message": "No trend data found"
            }

        trend_values = data[keyword].tolist()
        average_interest = sum(trend_values) / len(trend_values)
        peak_interest = max(trend_values)

        return {
            "keyword": keyword,
            "average_interest": round(average_interest, 2),
            "peak_interest": peak_interest,
            "trend_points": trend_values[-10:]
        }

    except Exception:
        return {
            "keyword": keyword,
            "average_interest": 0,
            "peak_interest": 0,
            "trend_points": [],
            "message": "Google Trends temporarily unavailable"
        }
