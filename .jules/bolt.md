## 2025-02-18 - Caching and Deduplication of Backend API Calls
**Learning:** Concurrent requests from multiple frontend components can cause "cache stampedes" if the backend doesn't deduplicate in-flight requests. Using a promise to represent the in-flight request prevents multiple identical downstream calls.
**Action:** When implementing caching for expensive backend operations, also use a shared promise variable to deduplicate concurrent requests.
