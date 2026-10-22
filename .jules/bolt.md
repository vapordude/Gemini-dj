## 2025-02-27 - Cache Stampede Prevention
**Learning:** Inflight promise deduplication prevents multiple concurrent API requests for the same un-cached resource.
**Action:** Use an inflight promise variable when caching expensive API calls to prevent stampedes.
