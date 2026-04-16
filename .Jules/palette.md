## 2024-05-24 - [Crossfader Keyboard Accessibility]
**Learning:** Custom UI elements like the Crossfader that hide the native HTML input visually (e.g., using `opacity-0`) lose native keyboard focus rings, making them inaccessible to keyboard users navigating via Tab.
**Action:** Use Tailwind's `peer` class on the visually hidden input and apply `peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400` on the visible proxy element (like a fader cap) to restore the expected keyboard focus indicator gracefully.
