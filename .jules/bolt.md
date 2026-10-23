## 2025-03-09 - Prevent YTMusic API cache stampede
**Learning:** Concurrent requests for home sections (used as a library proxy) triggered duplicate expensive calls before the first call could be cached, worsening startup latency.
**Action:** Implemented a deduplication pattern (`inflightHomeSectionsPromise`) alongside the `CACHE_TTL` to ensure concurrent requests await the same pending API response, preventing stampedes.
