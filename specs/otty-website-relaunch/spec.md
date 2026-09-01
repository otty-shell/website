# OTTY Website Relaunch

Status: ready-for-agent

## Problem Statement

The current OTTY website is a hand-authored static page that no longer provides a reliable public entry point to the product. Its positioning overstates parts of the product, its downloads are hard-coded to a deleted prerelease, it has no integrated Documentation, it does not consume the latest stable Published Release, and its GitHub Pages workflow deploys the repository root without building or validating a production artifact.

A Terminal-first Engineer needs one trustworthy public experience that explains what OTTY can do in the latest Published Release, proves those Current Capabilities with real Product Evidence, provides current Rolling Documentation, and leads to the correct native package for the engineer's platform. The maintainer needs that experience to remain fully static on GitHub Pages, synchronize public Documentation and release facts without copying them into the website repository, fail closed when upstream inputs are invalid, and remain straightforward to review locally before launch.

## Solution

Replace the current page with one fully static Astro site using Starlight for Documentation. The Product Landing at the root presents OTTY as an Early Release Terminal-first Workspace for development and operations across local and remote machines. It uses the selected Signal Sequence visual language, a compact proof-led narrative, and five real Product Evidence items grounded in the latest Published Release.

Rolling Documentation is authored in the OTTY repository's Public Documentation Source and staged ephemerally into the website during every build. Starlight supplies filesystem-driven navigation and Pagefind search. The Getting Started Binary installation guide is the canonical Installation and Downloads destination and embeds one website-owned LatestDownloads component whose facts and direct links come from a validated latest-stable GitHub Release.

One production pipeline responds to website changes, an hourly schedule, and manual dispatch. It checks out both repositories, stages Documentation, fetches and validates release data, builds Astro and Pagefind output, and deploys only the resulting dist artifact through a separately permissioned GitHub Pages job. A local production-preview command performs the same preparation and build using an explicit absolute `OTTY_DOCUMENTATION_INDEX` path, then serves dist for the maintainer's manual launch review.

## User Stories

1. As a Terminal-first Engineer, I want to understand immediately that OTTY is a Terminal-first Workspace, so that I can judge whether it fits the way I work.
2. As a Terminal-first Engineer, I want the positioning to cover development and operations across local and remote machines, so that the product's current scope is clear.
3. As a prospective user, I want OTTY identified as an Early Release, so that I do not mistake it for a mature or production-guaranteed product.
4. As a prospective user, I want public claims limited to the latest Published Release, so that I am not promised behavior that exists only on main or on a roadmap.
5. As a prospective user, I want Linux and macOS availability visible in the Hero, so that I can determine basic platform relevance without reading Documentation.
6. As a prospective user, I want a real Hero screenshot of the latest Published Release, so that the first visual proof represents the product I can install.
7. As a prospective user, I want the Product Landing to remain concise, so that I can understand OTTY without scrolling through generic marketing sections.
8. As a prospective user, I want a direct Download OTTY action, so that I can reach Installation and Downloads quickly.
9. As a prospective user, I want a direct Read docs action, so that I can inspect technical guidance before installing.
10. As a visitor, I want global links to Documentation, GitHub, and Installation and Downloads, so that the main destinations remain easy to reach.
11. As a visitor, I want the OTTY identity in the header to return me to the Product Landing, so that navigation is predictable.
12. As a visitor, I want a compact functional Footer, so that I can find Documentation, GitHub, the license, and contributor attribution without another marketing block.
13. As a Terminal-first Engineer, I want to see how OTTY shapes terminal sessions with tabs and splits, so that I can understand its workspace value.
14. As a Terminal-first Engineer, I want to see command and output blocks in real use, so that I can understand OTTY's semantic terminal interactions.
15. As a Terminal-first Engineer, I want to see Explorer beside terminal sessions, so that I can understand how project files remain in reach.
16. As a Terminal-first Engineer, I want to see Quick Launch for commands and SSH connections, so that I can understand fast reuse across local and remote work.
17. As a prospective user, I want SSH described as an SSH Client capability, so that I do not infer machine management or orchestration.
18. As a prospective user, I want Product Vision and roadmap ideas kept off the Product Landing, so that Current Capabilities remain unambiguous.
19. As a visitor, I want capability claims supported by real screenshots or recordings, so that the page demonstrates product truth rather than decorative concepts.
20. As a visitor, I want every Product Evidence frame shown in full, so that important application context is not removed by automatic cropping.
21. As a visitor, I want capability tabs to identify all four capability groups, so that I can choose the evidence that interests me.
22. As a keyboard user, I want to operate the capability tabs and media controls without a mouse, so that the presentation is usable with keyboard input.
23. As a screen-reader user, I want capability names, selected state, media alternatives, and controls exposed semantically, so that the sequence is understandable non-visually.
24. As a motion-sensitive visitor, I want automatic sequence advancement and video autoplay disabled when I prefer reduced motion, so that the site respects my setting.
25. As a visitor, I want a visible pause and play control, so that I can stop or resume automatic motion.
26. As a visitor, I want the capability sequence to pause while I hover or interact with it by keyboard, so that the content does not change while I am reading it.
27. As a visitor without JavaScript, I want all four Current Capability descriptions and their images or posters in the HTML, so that no product information disappears.
28. As a mobile visitor, I want the Hero, evidence, tabs, Documentation, and downloads to reflow without horizontal page scrolling, so that the site remains usable on a narrow screen.
29. As a visitor whose custom font fails to load, I want legible fallback typography without clipping, so that the site remains readable.
30. As a Documentation reader, I want a stable Documentation area, so that product guidance is separate from the Product Landing.
31. As a Documentation reader, I want the current Rolling Documentation from OTTY main, so that I read the material the maintainer currently publishes.
32. As a Documentation reader, I want filesystem-generated navigation, so that the visible structure follows the public authoring tree.
33. As a Documentation reader, I want page titles used as navigation labels, so that links use author-controlled names.
34. As a Documentation author, I want alphabetical file identifiers to provide default order, so that navigation remains deterministic without a second manifest.
35. As a Documentation author, I want to override navigation order through supported frontmatter, so that important pages can appear where readers expect them.
36. As a Documentation author, I want to write Markdown or narrowly supported MDX, so that I can use Starlight and approved website components without creating a client application.
37. As a Documentation author, I want only title to be required metadata, so that the website does not impose a larger editorial schema.
38. As a Documentation author, I want relative assets inside the Public Documentation Source to be preserved, so that pages and their media can move through staging together.
39. As a Documentation reader, I want local full-text search, so that I can find guidance without a hosted search provider.
40. As a Documentation reader, I want search results to open the correct page and anchor, so that search leads directly to relevant content.
41. As a Documentation reader without JavaScript, I want articles and ordinary links to remain readable and usable, so that search enhancement is not required to consume Documentation.
42. As a mobile Documentation reader, I want conventional Starlight header, sidebar, article, table-of-contents, and responsive navigation behavior, so that custom styling does not make Documentation unfamiliar.
43. As a visitor, I want the Product Landing excluded from Documentation search, so that Pagefind results remain focused on guidance.
44. As an installer, I want a stable Installation and Downloads route, so that documentation and external links can point to one durable destination.
45. As an installer, I want surrounding installation prose controlled by the Documentation author, so that commands and compatibility guidance are not inferred from release filenames.
46. As an installer, I want to see the latest stable version and publication date, so that I know which Published Release the page exposes.
47. As an installer, I want a link to the selected release notes, so that I can inspect the release before installing it.
48. As an installer, I want every available native Installation Method visible at once, so that platform detection never hides my actual choice.
49. As a Debian- or Ubuntu-style Linux user on x86-64, I want the validated deb package, so that I can choose the appropriate native package.
50. As an RPM-family Linux user on x86-64, I want the validated rpm package without unsupported distribution promises, so that I can make my own compatibility decision.
51. As an Apple Silicon Mac user, I want the validated Apple Silicon DMG, so that I do not install the Intel build accidentally.
52. As an Intel Mac user, I want the validated Intel DMG, so that I receive the matching architecture.
53. As an installer, I want each method to show platform, architecture, format, exact filename, rounded size, and a direct GitHub Release link, so that I can verify my selection.
54. As an installer, I want concise architecture help, so that Apple Silicon, Intel Mac, and Linux x86-64 labels are understandable.
55. As a Windows user, I want a clearly labeled Coming soon card without a disabled control, and as a Linux ARM64 user I want the platform shown as unavailable, so that current limitations remain explicit.
56. As an installer without JavaScript, I want all release facts and download links to work, so that installation does not depend on client scripting.
57. As an installer, I want one All releases link, so that I can browse prereleases and older Published Releases on GitHub.
58. As a macOS installer, I want accurate notice that OTTY is not notarized, so that Apple's first-launch warning is not surprising.
59. As a macOS installer, I want the supported Open Anyway steps, so that I can launch OTTY without unsafe Gatekeeper bypass instructions.
60. As an installer, I want no unsupported checksum, signature, or publisher-verification claim, so that operational release validation is not misrepresented as package trust.
61. As a future installer, I want new working Installation Methods to fit the same experience, so that a command or official external destination can be added without redesigning the page.
62. As a future installer, I want unavailable future methods omitted, so that the page does not accumulate placeholders.
63. As a release maintainer, I want a strict version-consistent v<SemVer> tag contract, so that every Published Release has one unambiguous version.
64. As a release maintainer, I want prerelease tags marked as GitHub prereleases, so that they never become the site's latest stable release.
65. As a release maintainer, I want all four packages assembled on a draft and published atomically, so that the website never sees a partially complete Published Release.
66. As a release maintainer, I want to rerun an existing tag destructively when needed, so that I can reproduce the complete Published Release without a second identity.
67. As a website maintainer, I want the site build to select and validate the latest stable Published Release, so that broken release metadata cannot reach visitors.
68. As a website maintainer, I want browsers to consume static generated Published Release facts while the Product Landing may refresh the public GitHub star count at runtime with a `0` fallback, so that release correctness never depends on a browser API call.
69. As a website maintainer, I want website changes to trigger a rebuild, so that source updates reach GitHub Pages normally.
70. As a website maintainer, I want an hourly synchronization, so that Rolling Documentation and the latest stable Published Release reach the site within one hour.
71. As a website maintainer, I want a manual synchronization command in GitHub Actions, so that I can recover from transient failures or refresh on demand.
72. As a website maintainer, I want failed checkout, staging, release validation, Pagefind, or Astro builds to stop deployment, so that the last successful Pages site remains live.
73. As a website maintainer, I want only the build job to read source inputs and only the deployment job to hold Pages write permission, so that deployment authority remains narrow.
74. As a website maintainer, I want obsolete concurrent builds cancelled, so that an older synchronization cannot replace a newer one.
75. As a website maintainer, I want a single local production-preview command, so that I can review the actual dist output without running staging, release generation, Astro, and Pagefind separately.
76. As a website maintainer, I want local Documentation selected explicitly through the absolute path to its index file, so that preview never depends on an assumed repository or Documentation location.
77. As a website maintainer, I want a local-only compliant release fixture, so that website development is possible before a live compliant Published Release exists.
78. As a website maintainer, I want final launch review to use the live GitHub Release rather than the fixture, so that exact production download links are verified.
79. As a website maintainer, I want a static production preview rather than an SPA development shell, so that local review matches GitHub Pages behavior.
80. As a search crawler, I want canonical public routes to return indexable HTML with crawlable links, so that the Product Landing and Documentation are technically eligible for indexing.
81. As a website maintainer, I want a production sitemap containing only canonical public routes, so that search engines receive the intended site inventory.
82. As a website maintainer, I want a manual launch checklist rather than a new browser automation system, so that the initial relaunch remains proportionate to the site's scale.
83. As a website maintainer, I want the production build reviewed for accessibility, supported browsers, performance, technical SEO, search, and downloads, so that I can make the launch decision directly.
84. As a website maintainer, I want a production smoke test immediately after cutover, so that obvious deployment or link errors are detected quickly.
85. As a website maintainer, I want a flawed deployment recovered through a normal source fix or revert and workflow rerun, so that no separate rollback platform must be maintained.

## Implementation Decisions

1. Build one static Astro application with Starlight. The Product Landing is served at /, Documentation at /docs/, and Installation and Downloads at /docs/getting-started/installation/binary/.
2. Configure the canonical site origin as https://otty.run with no repository base path. Preserve the custom-domain declaration in the deployed Pages artifact.
3. Every public route must be prerendered to HTML. Do not introduce runtime SSR, an application backend, a client-side router, or an SPA shell.
4. JavaScript is progressive enhancement for Pagefind search, the Signal Sequence interaction, media controls, optional platform emphasis, and Starlight's responsive menu. Primary content and direct links cannot depend on hydration.
5. Preserve the existing OTTY name and logo assets while replacing the current page's visual system and unsupported product copy.
6. The Product Landing has one global header and exactly three content regions: Hero, Current Capabilities, and Footer.
7. The global header contains OTTY identity linked to the Product Landing and ordinary links to Documentation, GitHub, and Installation and Downloads.
8. The Hero contains an Early Release badge, the OTTY name, the canonical statement “OTTY is a terminal-first workspace for development and operations across local and remote machines,” Download OTTY and Read docs actions, Linux and macOS availability, and one large real Hero screenshot.
9. The Product Landing contains no separate About, Why OTTY, workflow-story, open-source, roadmap, release, compatibility, testimonial, comparison, newsletter, or closing-CTA sections.
10. Current Capabilities are the four resolved groups: Shape your terminal workspace, Work with command blocks, Keep project files in reach, and Launch commands and connections. Public copy for each consists of a title, one benefit-oriented sentence, and one Product Evidence item.
11. The selected presentation is Signal Sequence. Its four compact tab labels are Workspace, Command blocks, Explorer, and Quick Launch. Tabs are the only sequence navigation; do not add previous or next arrows.
12. The sequence advances every six seconds, pauses on hover and while keyboard focus is within it, and exposes a visible pause/play control. Automatic changes never move keyboard focus or force live-region announcements.
13. Use accessible tab semantics and keyboard behavior. The selected state and every control's current action must be exposed to assistive technology.
14. If JavaScript is unavailable, render all four capability items in document order with their text and image or poster visible. Enhanced controls may be absent or inert, but content cannot be hidden behind the initially selected tab.
15. The Footer contains OTTY identity, Documentation, GitHub, license, and copyright or contributor attribution where applicable. It does not repeat the Download action or become a large sitemap.
16. Implement the Signal Sequence visual language as a near-black terminal-led canvas with restrained coordinate-grid texture, fine structural rules, cyan as the primary signal color, and magenta as a secondary accent. Color alone cannot convey focus, status, or errors.
17. Prefer dense bordered surfaces over generic rounded cards and decorative shadows. Use command-like labels, prompt syntax, indices, and a restrained cursor motif without presenting body copy as simulated terminal output.
18. Self-host JetBrains Mono WOFF2 files and use Adwaita Mono, Liberation Mono, and generic monospace fallbacks. Do not introduce a third-party font runtime.
19. Customize Starlight through public configuration, CSS, and the smallest necessary component overrides. Preserve its conventional header, search, sidebar, article, table of contents, skip navigation, and responsive navigation behavior.
20. On narrow screens, render the Hero in one column, keep every complete authored evidence frame visible, place the four capability tabs in a readable two-column arrangement, retain full download labels, and prevent horizontal page scrolling.
21. The Product Landing owns five canonical real Product Evidence items: one Hero screenshot and one item for each Current Capability group. Neither current repository screenshot is accepted as launch evidence.
22. The maintainer owns Product Evidence content, redaction, visual consistency, accuracy, and refresh timing. The website does not store an evidence manifest or validate release provenance, tag, commit, platform, or freshness.
23. Linux is the canonical Product Landing capture platform. A complete duplicate macOS set is not required.
24. Every screenshot is an sRGB PNG with authored alternative text and retains its authored dimensions. The build generates responsive AVIF and WebP variants while preserving PNG fallback, intrinsic dimensions, and the complete authored frame without automatic cover cropping.
25. The Hero is always a static screenshot. Each capability may use either a screenshot or a short recording.
26. Every recording is a silent WebM using VP9 Profile 0 and 8-bit 4:2:0 chroma subsampling. Recordings retain their authored dimensions, frame rate, duration, and file size; no duplicate MP4 is required, and GIF is not accepted. The completed Product Landing remains subject to the launch performance quality bar.
27. Every recording has a separate sRGB PNG poster with matching composition, poster alternative text, and a short text description of the demonstrated action.
28. Recordings play muted, inline, automatically, and in a loop under normal motion preferences, with a pause/play control. Reduced-motion preference prevents autoplay and uses the poster. A failed video still leaves the poster and description available.
29. The only Public Documentation Source is the directory containing the `index.md` file explicitly supplied through `OTTY_DOCUMENTATION_INDEX`. The website does not derive that directory from the OTTY repository root; internal OTTY documentation is never staged or rendered.
30. Every website build clears the generated Documentation staging area before copying the Public Documentation Source. The staged result and generated release data are ephemeral and are never committed.
31. Local staging uses the same synchronization behavior as production but requires the maintainer to provide an absolute `OTTY_DOCUMENTATION_INDEX` path explicitly. Do not assume a sibling repository or a fixed Documentation path inside it.
32. Public Documentation may contain Markdown and MDX. Every page requires title frontmatter; all other metadata remains optional.
33. File paths define Documentation routes, index.md defines the Documentation index, and relative assets must remain within the Public Documentation Source so staging preserves them.
34. MDX supports Starlight components and a narrow set of components exposed by the website as a stable authoring API. Arbitrary package imports and client applications are unsupported.
35. Starlight derives sidebar structure from the staged filesystem. Page titles provide labels, alphabetical file identifiers provide default order, and sidebar.order may override it. Do not add a website-owned navigation manifest.
36. Enable Starlight's Pagefind integration for Documentation only. Exclude the Product Landing. Do not introduce hosted search or a runtime search backend.
37. Build Pagefind from the completed production output. Any indexing error fails the build.
38. Documentation remains rolling and independent of Published Releases. Do not add release-aligned snapshots, current/preview/archive variants, version selectors, or version-scoped search.
39. The OTTY repository owns the authored Installation and Downloads page and its surrounding prose, commands, ordering, and compatibility statements. LatestDownloads owns the concise architecture, availability, and first-launch guidance placed directly beside its platform-specific choices.
40. The authored `Getting Started/Installation/Binary.mdx` page must include exactly one website-provided LatestDownloads MDX component. A missing page, missing component, or duplicate component fails the build.
41. LatestDownloads receives release facts from generated typed build data and accepts no authored release-specific values. It never obtains Published Release facts through a browser GitHub API call.
42. Generated release data includes the selected stable version, publication date, release-notes destination, the GitHub Releases destination, and method records containing platform, architecture, package format, exact filename, byte size, and browser_download_url.
43. LatestDownloads renders version as Latest stable, publication date, release notes, one All releases link, and every current Installation Method with an exact direct GitHub asset link. It does not expose package size, filename, or redundant method prose in the platform sections.
44. The first-launch methods are Debian- or Ubuntu-style Linux x86-64 through deb, RPM-family Linux x86-64 through rpm, Apple Silicon macOS through the aarch64 DMG, and Intel macOS through the x86_64 DMG.
45. Present Linux, macOS, and Windows as three full-width document sections in that order while keeping every current method simultaneously visible and usable without JavaScript. Each section uses an unnumbered level-two heading with a stable permalink and appears in Starlight's desktop and mobile On this page navigation. Within Linux and macOS, group methods into format rows and render one compact action per supported architecture. Linux has deb and rpm rows with x64 actions; macOS has one dmg row with ARM64 and Intel actions. Windows communicates Coming soon only.
46. Optional platform detection may emphasize a likely method but never hide methods, redirect, select authoritatively, or control which data is rendered.
47. Directly after each available platform's format list, explain Apple Silicon as M1 or newer, distinguish Intel Macs, describe Linux x64 as Intel or AMD 64-bit, and state that Linux arm64 or aarch64 has no package.
48. Show Windows as Coming soon in its own section without a disabled control or additional availability prose.
49. Compatibility promises beyond validated platform, architecture, and format remain authored Documentation. Do not infer operating-system or distribution support from filenames.
50. Directly after the macOS format list, state that OTTY is not notarized by Apple and describe Apple's supported System Settings → Privacy & Security → Open Anyway flow. Do not recommend disabling Gatekeeper or removing quarantine attributes.
51. Do not add generic checksum or signature warnings and do not claim that GitHub hosting verifies package integrity or publisher identity.
52. Model future working Installation Methods so that a method may resolve to a Published Release asset, a command, or an official external destination such as a Documentation page. Do not render placeholder actions or unavailable future methods; the Windows card remains status-only until a working method exists.
53. GitHub Releases is the durable source for Published Releases and package files. The website neither mirrors nor proxies package assets.
54. A Published Release is identified by a strict v<SemVer> tag whose version matches the OTTY repository VERSION and Cargo package version. A SemVer suffix marks a prerelease; a normal SemVer release is eligible as latest stable.
55. A compliant Published Release contains exactly four required assets using the `otty_<version>-<target>.<extension>` naming format: otty_<version>-amd64.deb, otty_<version>-x86_64.rpm, otty_<version>-aarch64-apple-darwin.dmg, and otty_<version>-x86_64-apple-darwin.dmg.
56. Release production in the OTTY repository creates a draft, builds and uploads the full matrix, and publishes only after all four assets succeed. Its implementation is an external prerequisite, not part of this website repository change.
57. A manual release rerun may delete and recreate an existing release for the same tag. The accepted effects are temporary unavailability, a new GitHub release identity, and reset download counts.
58. The website calls GitHub's public Releases API at build time, chooses the latest published stable release, validates strict SemVer and the exact four-asset matrix, and writes temporary typed data for rendering.
59. Ignore drafts, prereleases when selecting stable, bare tags without a GitHub Release, unexpected assets as Installation Methods, and the deleted v0.1.0-beta1 release.
60. Any missing stable release, invalid version, incomplete or incorrectly named matrix, API failure, or release-data generation error fails the build before deployment.
61. Before relaunch, the existing v0.1.0 Published Release must be recreated through the external release pipeline because its current RPM filename violates the contract. Do not add an alias or transitional validator exception.
62. Do not require a separate release manifest, public checksums, package signatures, provenance attestations, notarization, Linux repository signatures, or immutable-release migration.
63. Expose a package script named preview:production through the selected package manager. It requires `OTTY_DOCUMENTATION_INDEX`, clears and stages Documentation, obtains release input, runs the same release validator, builds Astro and Pagefind, serves the completed dist output, and prints the local URL.
64. Provide an explicit local-only compliant release fixture for development before a live compliant Published Release exists. It passes through the same release validator and cannot be selected by the production workflow.
65. Final launch preview does not use the fixture. It uses an absolute `OTTY_DOCUMENTATION_INDEX` path representing the intended Public Documentation Source and the live GitHub Release data.
66. Configure one GitHub Pages workflow for pushes to website main, an hourly schedule, and manual workflow dispatch. Cancel obsolete concurrent runs.
67. The read-only build job checks out both repositories, installs locked dependencies, stages Documentation, generates release data, and runs the production Astro build including Pagefind.
68. A dependent deployment job receives only the completed dist artifact and alone holds Pages write and identity permissions.
69. Any checkout, staging, release validation, Pagefind, or Astro error prevents deployment and leaves the last successful Pages deployment live.
70. Technical SEO requires substantive HTML on every public route, concise unique titles, absolute self-referencing canonicals using https://otty.run, crawlable internal anchor links, production robots rules that allow intended content, no accidental noindex, and a root sitemap containing only canonical public routes.
71. The Product Landing has an authored description. Documentation description remains optional and adds no frontmatter requirement beyond title.
72. Technical SEO does not promise actual indexing, ranking, or traffic.
73. The launch quality bar is maintainer-owned manual acceptance, not a new automated browser-quality suite. Run the complete review before initial cutover and after material visual or interaction changes, not before hourly content synchronizations.
74. Use WCAG 2.2 AA as the internal accessibility target without a public certification claim. Review complete keyboard use, focus, semantics, contrast, 200% text enlargement, 320 CSS pixel reflow, reduced motion, and one NVDA-on-Windows or VoiceOver-on-macOS smoke test.
75. Review representative surfaces in the current and immediately previous stable major versions of Chrome, Edge, Firefox, and Safari available at launch, plus current Safari on iOS and Chrome on Android. Older browsers, embedded webviews, and pixel-identical rendering are unsupported.
76. Run Lighthouse manually in one fixed mobile configuration against the Product Landing, Documentation index, a representative article, and Installation and Downloads. The median of five runs per surface must reach Performance 90, LCP at most 2.5 seconds, and CLS at most 0.1.
77. Manually verify three distinctive Pagefind queries that return their intended Documentation page and one absent query with a clear no-results state.
78. Manually compare every LatestDownloads fact and link with the live GitHub Release and open all four assets, release notes, and All releases.
79. Cutover requires the compliant Published Release, valid Public Documentation Source with exactly one LatestDownloads component, complete Product Evidence, successful production build, and completed manual checklist.
80. Immediately after deployment, smoke-test the production Product Landing, Documentation index, and Installation and Downloads, including primary navigation and direct package links.
81. No compatibility behavior is required for the legacy /#downloads fragment.
82. Do not add dedicated rollback artifact retention, an automatic rollback system, or a recovery-time objective. A successfully deployed defect is recovered by fixing or reverting website source and rerunning the normal workflow.

## Testing Decisions

1. The primary testing seam is the complete production artifact. Tests and review should observe the same pipeline boundary that GitHub Pages uses: Public Documentation Source plus release input enter the production build, and the observable result is either a failed build with no deployment or a completed dist artifact.
2. The preview:production package script is the human-facing entry point to that seam. It must require an absolute `OTTY_DOCUMENTATION_INDEX` path explicitly and perform staging, release validation, Astro generation, Pagefind indexing, and serving without requiring the maintainer to invoke those steps individually.
3. A good automated contract check, where one is needed for fail-closed behavior, asserts exit status and externally visible generated output rather than internal helper calls, private component state, CSS class names, or implementation-specific module structure.
4. The production build must demonstrably reject a missing Public Documentation Source, stale staging contamination, missing title, missing or duplicated LatestDownloads component, unavailable or invalid release data, prerelease-only input, and incomplete or incorrectly named package matrices.
5. The production build must demonstrably accept a minimal valid Public Documentation Source and a compliant stable release fixture and produce the canonical Product Landing, Documentation index, Installation and Downloads route, generated navigation, release facts, direct links, responsive evidence output, sitemap, canonical metadata, and Pagefind assets.
6. The local-only release fixture is exercised through the same validator and generated-data boundary as live API input. Tests must ensure the production workflow cannot select the fixture.
7. Documentation staging is tested at the highest filesystem boundary: a controlled absolute Documentation index path selects a source tree at an arbitrary filesystem location, that tree is cleared into the generated staging area, public Markdown, MDX, and relative assets appear once, and unrelated internal material does not appear.
8. Release validation is tested as a public data contract: strict version semantics, stable versus prerelease selection, exact filenames, exactly one asset per required method, direct GitHub URLs, byte sizes, release date, release notes, and failure on any missing or mismatched required value.
9. LatestDownloads is judged by its rendered production HTML and links, not by its internal component implementation. All four methods and their release facts must be present before client JavaScript runs.
10. Signal Sequence is judged by visible and accessibility behavior: four named tabs, selected state, keyboard operation, six-second advancement, hover and focus pause, explicit pause/play, no focus movement, reduced-motion behavior, complete media frames, and all fallback content in built HTML.
11. The Product Evidence pipeline is judged by generated image and video output: required dimensions and formats, responsive variants, intrinsic sizing, PNG and poster fallback, no cover cropping, authored alternatives, and preservation of content when video or JavaScript is unavailable.
12. Pagefind correctness is judged against the completed dist output, never the development server. Three chosen queries must find their intended page and one absent query must show a usable no-results state.
13. No new automated browser E2E suite, Lighthouse CI gate, automated accessibility scanner, visual-regression suite, or exhaustive component-unit coverage is required for the first launch.
14. Manual acceptance serves the completed production dist and covers the Product Landing, Documentation index, a representative article, search, and Installation and Downloads across the agreed browser, responsive, keyboard, screen-reader, reduced-motion, no-JavaScript, font-failure, and Lighthouse checks.
15. Manual no-JavaScript review reloads the production preview with scripting disabled and verifies Product Landing content and primary links, all capability text and evidence fallbacks, readable Documentation with a route to its index, and complete release facts and downloads.
16. Manual release review uses the live GitHub Release, never the local fixture, and opens the exact four browser_download_url values plus release notes and All releases.
17. Production smoke testing immediately after cutover verifies the deployed origin and the three canonical entry routes. Failure recovery is then tested operationally only through the normal source fix or revert and workflow rerun path.
18. The current repository has no automated test infrastructure or comparable Astro implementation to reuse. The existing GitHub Pages workflow is prior art only for the deployment boundary; the Signal Sequence prototype is a decision reference, not production code or a test oracle.

## Out of Scope

- Implementing machine inventory, monitoring, lifecycle management, lab management, cluster orchestration, or other OTTY product capabilities.
- Presenting Operational Hub as positioning or Product Vision.
- Presenting features available only on OTTY main as Current Capabilities.
- A Product Landing roadmap, Product Vision section, testimonials, comparisons, newsletter, blog, CMS, analytics, or long-form marketing expansion.
- User accounts, cloud functionality, a runtime application backend, SSR, a client-side SPA, or a hosted search service.
- Release-aligned Documentation snapshots, preview Documentation, archived Documentation, version selectors, version-scoped search, or prescribed Documentation sections and feature coverage.
- Contributor, internal, or API documentation and any ingestion of OTTY documentation outside the Public Documentation Source.
- Localization at first launch; public content is English.
- A separate Documentation application or subdomain.
- A Git submodule, custom remote content loader, or committed snapshot of cross-repository Documentation.
- Arbitrary MDX package imports or authored client applications.
- An on-site historical Release Catalog; GitHub owns prerelease and older-release browsing.
- New Installation Methods such as Homebrew, Apt repositories, or an install script.
- Placeholder actions and disabled Installation Method controls.
- Public checksums, detached signatures, package or repository signatures, provenance attestations, immutable releases, Apple Developer ID signing, or notarization.
- Mirroring or proxying release packages through the website.
- A release manifest separate from GitHub Release metadata.
- Implementing the OTTY repository's release pipeline in this website repository; that is separate work using the Published Release contract in this specification.
- Migrating the deleted v0.1.0-beta1 release or preserving the legacy /#downloads fragment.
- A Product Evidence capture harness, prescribed sample data, evidence manifest, automated redaction, provenance validation, release-freshness validation, or duplicate macOS capture set.
- Promoting prototype code into production or using the placeholder prototype screenshot as Product Evidence.
- A full OTTY rebrand.
- Formal public WCAG certification, guaranteed search-engine indexing or ranking, product analytics, or a day-zero field Core Web Vitals guarantee.
- A new automated browser-quality suite, browser E2E suite, visual-regression system, Lighthouse CI gate, or automated rollback platform.
- Dedicated rollback artifact retention or a recovery-time objective.

## Further Notes

- This specification synthesizes the resolved OTTY Website Relaunch wayfinding map. Later implementation should use the canonical terms in the OTTY Website domain glossary.
- The selected visual reference is Signal Sequence on branch prototype/otty-web-visual-language at commit 80b6553ef90d841710ae5931c82b9238396ccf1a. It is a disposable decision artifact; production uses Astro, Starlight, public framework seams, and production components.
- The existing OTTY name and logo assets are retained. The existing website screenshot is not accepted as launch Product Evidence.
- The current website repository contains only a basic static page and a repository-root Pages deployment. No framework, lockfile, build system, or test suite exists yet, so implementation establishes the Astro project and replaces the Pages workflow.
- The first public content language is English.
- A compliant latest-stable Published Release is a launch prerequisite. The separate OTTY release-pipeline work should be completed early enough that final local preview can use live release data instead of the development fixture.
- `OTTY_DOCUMENTATION_INDEX` is the explicit absolute path to the Public Documentation Source `index.md` used by production preview. There is no implicit repository location or fixed Documentation subdirectory.
