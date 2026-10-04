## 2024-05-15 - [Backend] Add in-memory TTL cache for getHomeSections
**Learning:** Found an opportunity to cache ytmusic.getHomeSections() since it is used as a proxy to fetch user library data across multiple endpoints (/library/playlists, /library/songs, /library/artists) and could lead to cache stampedes if called concurrently.
**Action:** Implemented a deduplication pattern using an `inflightHomeSectionsPromise` and a 5-minute TTL cache to minimize expensive third-party API calls while ensuring concurrent requests share the same promise.
