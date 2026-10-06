## 2025-02-20 - API Request Coalescing and Caching
**Learning:** Cache stampedes can occur when multiple concurrent frontend components request data from the same backend endpoint (like different library tabs triggering `ytmusic.getHomeSections()` simultaneously) before the cache is populated.
**Action:** Implement both a short-TTL cache and an in-flight promise tracker (request coalescing) to ensure multiple simultaneous callers await the same API response rather than triggering parallel expensive downstream API requests.
