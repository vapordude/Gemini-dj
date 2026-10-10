## 2025-02-14 - Mitigating Cache Stampedes
**Learning:** Concurrent requests fetching large payloads can cause a cache stampede if not deduplicated while in-flight.
**Action:** Use an in-flight Promise tracker to ensure all concurrent requests await a single API response before caching.
