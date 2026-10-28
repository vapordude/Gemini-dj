## 2026-10-28 - Cache stampedes in library endpoints
**Learning:** This codebase fetches getHomeSections across three distinct library endpoints when a user navigates tabs, making it highly susceptible to redundant external API calls and cache stampedes.
**Action:** Use an inflight Promise deduplication pattern (with a simple TTL cache) before the actual data fetching call to ensure multiple concurrent callers wait on the same network request.
