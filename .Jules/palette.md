## 2026-04-10 - Multi-condition Disabled Button Tooltips
**Learning:** When buttons have multiple conditions for being disabled (e.g., missing tracks vs. currently generating), a generic 'Disabled' state provides poor UX.
**Action:** Pair the disabled attribute with explicit visual cues (e.g., disabled:opacity-50, disabled:cursor-not-allowed) and use conditional statements to ensure the title tooltip mirrors the exact failing condition.
