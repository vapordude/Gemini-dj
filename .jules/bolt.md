## 2025-02-28 - Deduplicate Concurrent API Requests

**Learning:** Uncached repeated API calls (`ytmusic.getHomeSections()`) during parallel component mounting can lead to severe cache stampedes/N+1 issues, slowing down the backend response times significantly.
**Action:** Use an `inflightPromise` pattern alongside time-based caching (or a library like `dataloader`) to deduplicate concurrent requests and avoid stampedes.
