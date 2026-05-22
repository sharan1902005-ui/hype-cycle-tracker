from cachetools import TTLCache

analysis_cache = TTLCache(maxsize=100, ttl=300)