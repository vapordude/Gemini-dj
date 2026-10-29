## 2025-02-27 - ytmusic.getHomeSections Cache Stampedes
**Learning:** The frontend made multiple concurrent calls to library routes (playlists, songs, artists), triggering multiple simultaneous external API calls to ytmusic.getHomeSections() because there was no inflight request deduplication, causing a cache stampede.
**Action:** Implemented getCachedHomeSections with both a 5-minute cache TTL and an inflightHomeSectionsPromise to deduplicate concurrent requests. Always ensure expensive proxy endpoints deduplicate concurrent callers.
