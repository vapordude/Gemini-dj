
## 2026-10-24 - Prevent API Cache Stampedes
**Learning:** In backend endpoints (like those calling ytmusic-api), relying solely on time-based caching isn't enough when multiple concurrent requests hit an expired cache. This causes a 'cache stampede' where all requests trigger the expensive API call simultaneously.
**Action:** Use an 'inflight promise' deduplication pattern alongside a time-to-live (TTL) cache. If a request comes in while the API call is already fetching, return the existing promise so all callers await the single response.
