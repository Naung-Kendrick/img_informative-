# Micro-Interactions & State Feedback: Best Practices

This document outlines the design philosophy and implementation standards for micro-interactions within our application to ensure a **premium, Stripe/Vercel-like experience**.

## 1. The UX Feedback Loop

Every user action must follow a consistent path to provide cognitive closure and confidence.

1.  **Direct Interaction**: The element must respond immediately to a click/tap (e.g., scale-down effect in `LoadingButton`).
2.  **Processing State**: Provide a clear visual transition to "Loading" (e.g., spinner) while preventing double-submissions by disabling buttons.
3.  **Completion Transition**: Never let a spinner just "vanish." Instead, smoothly transition into a Success checkmark or an Error alert.
4.  **Global Confirmation**: Use a Toast notification for a consistent, system-level confirmation message.
5.  **State Reset**: After 2-3 seconds, revert the success state to "Idle" to allow for reuse.

---

## 2. Accessibility (A11y)

Our components are designed to be screen-reader friendly and keyboard navigable.

- **`aria-busy`**: Use this on buttons/containers during long-running tasks.
- **`aria-live="polite"`**: Use this on regions that update dynamically (like success checkmarks) so screen readers announce the state change.
- **Disabled State**: Always disable interactive elements during loading to prevent race conditions and unintentional double-clicks.
- **Color Contrast**: Ensure all status colors (Emerald for success, Rose for error) have sufficient contrast ratios.

---

## 3. Component Standards

### `LoadingButton`
Use for all primary actions.
- **Props**: `isLoading`, `isSuccess`, `successText`.
- **Constraint**: Never change the height or width during state transitions (prevent layout shift).

### `MotionPage`
Use as the root of all significant pages.
- **Benefit**: Smooth entrance animations reduce perceived latency.
- **Staggering**: Use `MotionStaggerItem` for lists or form fields to lead the user's eye from top to bottom.

### `ProfessionalToaster`
Global notification system.
- **Success**: Positive green tone.
- **Error**: High-vibrancy Red for urgency.
- **Loading**: Use for multi-step processes where the "end" is uncertain.

---

## 4. Visual Excellence Tip: Easing

Avoid "Linear" or "Standard" CSS transitions for important elements. Use **Cubic Bezier** easings or **Spring** physicist values for animations.

- **Premium Feel**: `ease: [0.23, 1, 0.32, 1]` for a modern, snappy snap.
- **Haptic Feel**: `whileTap={{ scale: 0.98 }}` for immediate feedback.
