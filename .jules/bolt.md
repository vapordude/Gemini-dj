## 2025-03-01 - Cache Stampede in YTMUSIC API Wrapper
**Learning:** `ytmusic.getHomeSections()` was used as a proxy for the library because specific library endpoints are not exposed by `ytmusic-api`. Since this is called in multiple endpoints (playlists, songs, artists) during page load, it triggered simultaneous expensive API calls ("cache stampede") stalling the frontend.
**Action:** Prevent stampedes by deduplicating concurrent requests using an inflight promise (`inflightHomeSectionsPromise`) alongside a standard TTL cache for subsequent requests.
