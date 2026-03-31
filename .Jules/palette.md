## 2024-03-31 - Icon-only Tab Navigation Accessibility
**Learning:** Icon-only navigation tabs without labels create a complete barrier for screen reader users and add cognitive load for users unfamiliar with the iconography. Relying solely on visual active states is insufficient for full accessibility.
**Action:** Always include both `aria-label` (for screen readers) and `title` (for mouse hover tooltips) on icon-only buttons. Additionally, ensure proper keyboard navigation visibility using explicit `focus-visible` styles like `focus-visible:ring-2` to support keyboard users.
