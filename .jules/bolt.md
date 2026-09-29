## 2024-03-10 - Cache YTMusic Home Sections API calls
**Learning:** `ytmusic.getHomeSections()` was a significant bottleneck, frequently queried across library endpoints (`/library/playlists`, `/library/songs`, `/library/artists`) and used as a fallback for missing authentication endpoints. Given the static nature of the data, this caused unnecessary latency and potential rate-limiting.
**Action:** Implemented a caching mechanism (`getCachedHomeSections()`) with a 5-minute TTL and request deduplication (in-flight promise handling) to ensure concurrent requests only trigger one API call.
