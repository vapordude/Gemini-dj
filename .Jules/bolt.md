## 2023-10-24 - Add TTL cache and deduplication for getHomeSections
**Learning:** High frequency requests to ytmusic.getHomeSections() can cause cache stampedes. We need a cache (TTL) and we need promise deduplication to ensure multiple simultaneous callers await the same API response.
**Action:** Always implement promise deduplication alongside basic caching when a single expensive operation might be called concurrently multiple times, storing the inflight promise.
