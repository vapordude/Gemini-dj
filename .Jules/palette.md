## 2026-04-23 - Multi-condition Disabled Button UX
**Learning:** When a button has multiple reasons for being disabled (like loading vs invalid state), combining a conditional `title` tooltip with matching `cursor` tailwind classes (e.g., `cursor-wait` vs `cursor-not-allowed`) is an elegant pattern. Using a global `disabled:cursor-not-allowed` conflicts when you need a loading cursor.
**Action:** Use conditional statements to ensure the title tooltip and cursor styling exactly mirror the specific condition failing, rather than generic disabled messages/styles.
