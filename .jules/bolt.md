## 2023-10-01 - [C++ Map Lookup Optimization]
**Learning:** Double `std::map` lookups (e.g., `find()` followed by `operator[]`) is O(2 log N) and inefficient.
**Action:** Replace with a single `find()` call that stores and reuses the resulting iterator to improve performance to O(log N).
