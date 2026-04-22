## 2024-05-24 - Initial setup
**Learning:** Started tracking UX learnings.
**Action:** Keep updating this file with critical insights.

## 2026-04-22 - Dynamic Tooltips for Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., 'Missing tracks' vs 'Currently generating transition'), using a single static tooltip or relying only on visual cues is confusing. Users need to know *why* an action is blocked.
**Action:** Always provide conditional `title` attributes (or ARIA descriptions) and distinct styling (e.g., opacity-50 cursor-not-allowed vs cursor-wait) that accurately reflect the current blocking condition.
