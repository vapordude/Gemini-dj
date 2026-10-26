
## 2026-10-26 - Prevent cache stampedes with inflight promises
**Learning:** When multiple concurrent API requests rely on the same slow external fetch (like ytmusic.getHomeSections() acting as a proxy for library endpoints), a simple TTL cache is insufficient because it creates a cache stampede during the initial fetch or cache invalidation.
**Action:** Always pair TTL caching with an `inflightPromise` tracker to deduplicate concurrent requests. This ensures multiple simultaneous callers await the same underlying API response rather than triggering duplicate network requests.
