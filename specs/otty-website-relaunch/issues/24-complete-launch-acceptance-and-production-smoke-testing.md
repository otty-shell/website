# 24 — Complete launch acceptance and production smoke testing

**What to build:** Perform the maintainer-owned launch decision against the complete production artifact and intended live inputs, then verify the deployed public site immediately after cutover. Record enough results to distinguish a completed launch review from an untested build without introducing a new automated browser-quality platform.

**Blocked by:** 23 — Deploy synchronized artifacts through GitHub Pages.

**Status:** ready-for-human

- [ ] Before cutover, confirm a compliant live Published Release, a valid intended Public Documentation Source containing exactly one `LatestDownloads`, all five launch Product Evidence items, and a successful live-input production build; the local fixture is not used.
- [ ] Review Product Landing, Documentation index, a representative article, search, and Installation and Downloads for WCAG 2.2 AA keyboard behavior, focus, semantics, contrast, 200% text enlargement, 320 CSS pixel reflow, reduced motion, font failure, and no-JavaScript behavior without making a public certification claim.
- [ ] Complete one NVDA-on-Windows or VoiceOver-on-macOS smoke test and representative checks in the current and immediately previous stable major Chrome, Edge, Firefox, and Safari versions available at launch, plus current Safari on iOS and Chrome on Android.
- [ ] Run Lighthouse in one fixed mobile configuration against the Product Landing, Documentation index, a representative article, and Installation and Downloads; the median of five runs per surface reaches Performance 90, LCP at most 2.5 seconds, and CLS at most 0.1.
- [ ] Verify three distinctive Pagefind queries reach their intended page and anchor and one absent query produces a clear no-results state.
- [ ] Compare every rendered release fact with the live Published Release and successfully open all four direct package URLs, release notes, and All releases.
- [ ] Check canonical metadata, robots rules, sitemap inventory, primary navigation, complete uncropped evidence, media controls, and the absence of unsupported compatibility, trust, roadmap, or Current Capability claims.
- [ ] After cutover, smoke-test `https://otty.run/`, `/docs/`, and `/docs/install/`, including primary navigation and direct package links.
- [ ] If the deployment is flawed, recover through a normal source fix or revert and workflow rerun rather than a separate rollback platform, and repeat the affected smoke checks.
