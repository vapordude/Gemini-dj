## 2025-02-23 - Prevent Cache Stampedes
**Learning:** Concurrent requests fetching user library proxy data via getHomeSections can cause cache stampedes. Implementing deduplication with an in-flight promise alongside caching solves this.
**Action:** Always consider deduplicating concurrent identical API requests in Node.js apps.
