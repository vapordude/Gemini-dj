## 2024-10-24 - Dynamic Tooltips for Multi-Condition Disabled States
**Learning:** When a button can be disabled for multiple reasons (e.g., "generating transition" vs "missing tracks"), generic styling and a static disabled state are insufficient. Users need to know exactly *why* it's disabled.
**Action:** Always provide explicit visual cues (`opacity-50`, `cursor-not-allowed`) and pair them with dynamic `title` attributes that mirror the exact failing condition.
