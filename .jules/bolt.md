## 2025-02-27 - Preventing Cache Stampedes
**Learning:** Concurrent requests triggering the same expensive backend API call can cause a "cache stampede" if the cache is empty, resulting in rate-limiting or heavy load. Caching the resolved data alone is not enough; the in-flight Promise must also be cached and awaited by concurrent requests.
**Action:** Always store a reference to the in-flight Promise (e.g., `inflightPromise`) for expensive asynchronous operations so multiple simultaneous callers can await the same API response rather than duplicating the request.
