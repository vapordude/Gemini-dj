## 2025-02-14 - Preventing Cache Stampedes
**Learning:** High-traffic endpoints that aggregate external API data (like YTMUSIC) can cause cache stampedes. Concurrent requests firing before the cache is warmed will all trigger the external API simultaneously.
**Action:** Use an inflight promise (`inflightHomeSectionsPromise`) alongside the `CACHE_TTL` to ensure multiple simultaneous callers await the same API response instead of triggering duplicate requests.
