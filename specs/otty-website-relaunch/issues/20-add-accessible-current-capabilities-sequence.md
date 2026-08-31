# 20 — Add the accessible Current Capabilities sequence

**What to build:** Progressively enhance the static Current Capabilities content into the selected Signal Sequence. Visitors can choose among the four capabilities, allow or stop automatic movement, and consume still or motion Product Evidence without losing content, focus, or control under keyboard, reduced-motion, failed-media, or no-JavaScript conditions.

**Blocked by:** 19 — Publish the proof-led Product Landing.

**Status:** ready-for-agent

- [ ] Four compact tabs named Workspace, Command blocks, Explorer, and Quick Launch are the only sequence navigation; previous and next arrow controls are not added.
- [ ] Tabs expose correct tablist, tab, panel, selected-state, and keyboard behavior, and automatic changes never move focus or force live-region announcements.
- [ ] The selected capability advances every six seconds, pauses while hovered or while keyboard focus is within the sequence, and has a visible pause/play control whose accessible name reflects its current action.
- [ ] Reduced-motion preference prevents automatic sequence advancement and video autoplay, while a visitor can still choose capabilities explicitly.
- [ ] Under ordinary motion preferences, recordings play muted and inline in a loop with their own pause/play control; failed video still leaves its poster and text description available.
- [ ] With JavaScript disabled, all four capability descriptions and image or poster fallbacks remain visible in document order and primary links continue to work.
- [ ] Capability screenshots and posters retain intrinsic sizing, responsive variants, authored alternatives, PNG fallback, and the complete uncropped frame.
- [ ] On narrow screens the four tabs form a readable two-column arrangement without clipped labels or horizontal page scrolling.
- [ ] Verification observes rendered and accessibility behavior rather than private component state or CSS selectors and does not introduce a new browser E2E, visual-regression, or exhaustive component-unit suite.
