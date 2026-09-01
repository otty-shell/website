# Define the Launch Quality Bar

Type: grilling
Status: resolved
Blocked by: 06, 09, 10, 12

## Question

Which measurable SEO, accessibility, performance, browser-support, Product Evidence image and motion-fallback behavior, rolling-Documentation staging and Pagefind correctness, `<LatestDownloads />` rendering and exact release-link correctness, compliant latest-stable release readiness, authored macOS installation-guidance accuracy, legacy `/#downloads` handling, deployment cutover, rollback, and recovery criteria must the rebuilt Astro/Starlight website meet before it replaces the current site, and which core navigation, documentation, installation, and download behavior must remain usable without JavaScript?

## Resolved visual input

The selected visual direction is `Signal Sequence`: a near-black, cyan-and-magenta, terminal-led system using locally hosted JetBrains Mono with system monospace fallbacks. The quality bar must cover legibility, contrast, visible focus, font loading and fallback behavior, responsive layout, and the absence of unintended horizontal page scrolling across the custom Landing, Starlight Documentation, and `<LatestDownloads />`.

The Landing capability sequence has exactly four labeled tabs and no previous or next arrows. It advances every six seconds, pauses while hovered or keyboard-focused, exposes a pause/play control, preserves every complete authored evidence frame, and disables automatic advancement for reduced-motion preferences. Capability video still follows the separate poster and motion-fallback contract. All capability content is present in built HTML; this ticket must set the measurable keyboard, screen-reader, no-JavaScript, and failure-state criteria for its presentation.

Documentation retains Starlight's standard header/search, sidebar, article, table-of-contents, and responsive-navigation behavior beneath the OTTY theme. `<LatestDownloads />` uses three full-width platform sections with stable heading permalinks, matching desktop and mobile On this page entries, ruled format rows, and non-clipping architecture actions. The quality bar must verify that visual customization does not regress those framework behaviors or obscure exact download facts, statuses, links, or adjacent platform guidance.

## Answer

The maintainer makes the relaunch go/no-go decision after a manual review of a production build. The quality bar is a repeatable launch checklist, not a new automated browser-quality suite: no Lighthouse CI, automated accessibility scanner, or cross-browser end-to-end suite is required for the first launch. The complete checklist is run before the initial cutover and after material visual or interaction changes, but not before hourly Rolling Documentation synchronizations. Existing fail-closed build invariants remain automated because they are part of the Published Release and site architecture contracts rather than this manual acceptance review.

### Accessibility, browser support, and responsive presentation

WCAG 2.2 AA is the internal accessibility acceptance target, without a public certification or formal conformance claim. The manual review covers the Product Landing, Documentation index, a representative article, search, and Installation and Downloads. It verifies complete keyboard operation without traps; logical order and visible focus; correctly exposed names, roles, states, headings, landmarks, alternative text, and motion descriptions; text contrast of at least 4.5:1, large-text and non-text contrast of at least 3:1; text enlargement to 200%; reflow at 320 CSS pixels; and no unintended horizontal page scrolling. One desktop screen-reader smoke test is required using either NVDA on Windows or VoiceOver on macOS. Search, the capability sequence, responsive navigation, and all download actions must remain understandable in that test.

The same representative surfaces are reviewed in the current and immediately previous stable major versions of Chrome, Edge, Firefox, and Safari available at launch, plus current Safari on iOS and Chrome on Android. Essential implementation features should be Baseline Widely Available; older browsers, embedded webviews, and pixel-identical rendering are not launch commitments. At narrow and wide sizes, Starlight's header, sidebar, article, table of contents, search, and responsive menu remain usable, while every `<LatestDownloads />` format row keeps its complete label and architecture actions without horizontal clipping.

JetBrains Mono is served locally with system monospace fallbacks and no third-party font request. Normal, slow, and blocked custom-font loading must leave all text legible, prevent overlap or clipping, and avoid a disruptive layout shift. Focus, errors, and state do not rely on cyan, magenta, or color alone.

### Performance and technical SEO

The maintainer runs Lighthouse manually in one fixed mobile configuration against the Product Landing, Documentation index, a representative article, and Installation and Downloads. The median of five repeat runs for each surface must have a Performance score of at least 90, LCP no greater than 2.5 seconds, and CLS no greater than 0.1. Complete field Core Web Vitals cannot be a day-zero gate; later CrUX observations do not add a product-analytics implementation requirement.

The SEO guarantee is technical crawlability and indexability, not actual indexing, ranking, or traffic. Every intended public canonical route returns `200`, contains substantive content in built HTML, has a concise unique title, uses an absolute self-referencing canonical URL at `https://otty.run`, is reachable through ordinary `<a href>` links, and is neither blocked by production robots rules nor marked `noindex`. The Product Landing has an authored description; a Documentation description may be authored or generated when available, but its absence does not add a new frontmatter requirement beyond the already contracted `title`. The root sitemap contains only canonical public URLs, uses the production origin, and excludes broken or non-public routes. Internal links and referenced local assets must resolve. These checks cover the Product Landing and Rolling Documentation even though Pagefind intentionally indexes Documentation only.

### Static HTML and JavaScript boundaries

The site remains a statically rendered Astro site, not an SPA: every route delivers its primary content as HTML without a client-side router or an application shell that must hydrate before becoming useful. JavaScript may progressively enhance search, the capability sequence, media controls, platform emphasis, and Starlight's responsive menu.

With JavaScript disabled, the Product Landing still exposes its identity, claims, primary navigation, Documentation and Download actions, all four Current Capability labels and descriptions, and usable evidence images or posters. Documentation articles remain readable, ordinary content links work, and every page provides a static route back to the Documentation index even when the responsive menu cannot open. Installation and Downloads still renders the selected release facts, all four native Installation Methods, their exact direct links, release notes, and `All releases`. Pagefind search, automatic sequence advancement, pause/play enhancement, platform emphasis, and the interactive mobile-menu toggle do not require no-JavaScript equivalents.

### Product Evidence and Signal Sequence

The launch candidate contains the complete five-item Product Evidence set and its required authored alternative text, posters, and motion descriptions. Responsive image output includes the contracted AVIF and WebP variants with PNG fallback, intrinsic dimensions, and a working source selection. Every complete authored frame remains visible without `cover` cropping at each reviewed size, and failed video loading leaves its poster and description available.

The four labeled capability controls use keyboard- and screen-reader-understandable tab semantics, expose the selected state, and do not move focus or force live announcements when the sequence advances. Mouse and keyboard selection work, automatic advancement uses the agreed six-second interval, hover and keyboard focus pause it, and the visible pause/play control reports its current action. Each capability recording also remains pausable. A reduced-motion preference disables all automatic sequence advancement and video autoplay and shows the poster instead. Without JavaScript, all four capability items remain present in document order rather than collapsing behind the first tab.

### Rolling Documentation and Pagefind

The initial review confirms that a clean staging run cleared prior generated content and copied only the Public Documentation Source selected by the explicit absolute index path into the generated Starlight source tree. Every staged page produces its expected route and navigation title, local relative assets resolve, authored ordering is respected, and no internal OTTY documentation leaks into the public output. A missing or invalid public tree, missing title, broken staging operation, or missing `Getting Started/Installation/Binary.mdx` source remains a build failure and leaves the last successful deployment live.

Pagefind is generated from the completed production output, indexes Documentation but not the Product Landing, emits its static browser assets, and opens through Starlight's search UI. The maintainer tests three distinctive queries chosen from the staged Documentation and confirms that each returns its intended page, then tests one absent query and receives a clear no-results state. Results open the correct route and anchor, and the search dialog can be opened, operated, and closed by keyboard. Search availability without JavaScript is not required.

### Published Release, downloads, and macOS guidance

The rebuilt site cannot cut over until the latest stable release is a compliant Published Release. In particular, the current `v0.1.0` must first be recreated through the new release pipeline with the exact contracted four-package matrix; no legacy RPM-name exception is accepted. The build continues to fail closed when stable release selection, strict SemVer, tag/version consistency, or any required asset validation fails.

The maintainer compares the rendered `<LatestDownloads />` against the generated release data and GitHub Release before launch. Version, publication date, release-notes URL, platform and format grouping, compact architecture labels, direct `browser_download_url`, and the GitHub Releases destination must all match. Exact filenames and byte sizes remain validated release data rather than visible section content. All four package links, the release-notes link, and the single `All releases` link are manually opened. Every method remains simultaneously visible; optional detection may emphasize but never hide or redirect; Windows contains only `Coming soon`, and Linux ARM64 remains plainly unavailable in the Linux note without a timing promise.

The macOS note immediately after the dmg row must accurately say that OTTY is not notarized by Apple and describe the supported `System Settings → Privacy & Security → Open Anyway` flow current at cutover. It must not recommend disabling Gatekeeper or removing quarantine attributes. The maintainer checks this wording alongside the download facts.

### Cutover, failures, and recovery

The cutover prerequisites are the compliant Published Release, a valid current Public Documentation Source containing exactly one `<LatestDownloads />` on the Binary installation guide, the complete Product Evidence set, a successful production build, and the maintainer's completed manual checklist. After deployment, the maintainer immediately smoke-tests `https://otty.run/`, `/docs/`, and `/docs/getting-started/installation/binary/`, including their primary navigation and direct download links.

No compatibility behavior is required for the legacy `/#downloads` fragment: it may simply open the Product Landing without scrolling or redirecting. No dedicated rollback artifact retention, recovery-time objective, or automatic rollback system is required. A failed build or upstream synchronization never deploys and leaves the last successful Pages site live. If a flawed build deploys successfully, the maintainer detects it through the production smoke test or normal observation, fixes or reverts the website source, and reruns the normal workflow manually. GitHub Pages availability itself is trusted rather than treated as a site-owned recovery problem.
