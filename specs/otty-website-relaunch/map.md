# OTTY Website Relaunch

Label: wayfinder:map
Status: resolved

## Destination

Reach a complete set of product, distribution, visual, and technical decisions from which `/to-spec` can produce a buildable specification for the OTTY Product Landing and rolling Documentation experience, including latest-stable Installation and Downloads, automated Published Releases, hourly and manual synchronization, and measurable SEO guarantees.

## Notes

- This map produces decisions, not the production implementation. Hand off to `/to-spec`, `/to-tickets`, and `/implement` when the map is clear.
- Use the domain language in [`CONTEXT.md`](../../CONTEXT.md). Invoke `/grilling` and `/domain-modeling` for grilling tickets, `/prototype` for prototype tickets, and `/research` for research tickets.
- The public content language for the first launch is English.
- The first launch remains on GitHub Pages and uses one fully static Astro site with Starlight for Documentation; indexable HTML and measurable SEO outcomes remain requirements.
- The Product Landing is one page. Documentation is a separate user-facing area, and Installation and Downloads lives within Documentation.
- Documentation is rolling content maintained on `otty/main`. The website synchronizes and renders it without prescribing sections, feature coverage, warnings, or release-aligned versions.
- Installation and Downloads links directly only to the latest stable Published Release. Prereleases and older releases are delegated to GitHub through one `All releases` link.
- Product Landing claims must be grounded in Current Capabilities and Product Evidence. OTTY is positioned as a Terminal-first Workspace for development and operations across local and remote machines; Operational Hub is not part of the positioning or Product Vision.
- The Product Landing owns five real `16:10` Product Evidence items: one static Hero screenshot and one screenshot or short recording for each Current Capability group. The maintainer supplies and manually refreshes them; decorative mockups, provenance automation, and release-freshness validation are outside the contract.
- The initial Installation Methods are the existing native packages. The model must allow additional methods later.
- Release-pipeline implementation will be a separate task in the `otty` repository after this map defines the cross-repository Published Release contract.
- Preserve the existing OTTY name and logo assets while allowing a new web visual language. A full rebrand is outside this effort.

## Decisions so far

- [Audit OTTY's Current Product Truth](issues/01-audit-current-product-truth.md) — OTTY can currently claim an early terminal-centric workspace with tabs, splits, Bash/Zsh command blocks, Explorer, saved commands, and an SSH Client; broader machine or cluster management is unavailable.
- [Research GitHub Pages and Release Automation Constraints](issues/02-research-pages-release-automation.md) — GitHub Releases is the durable release source and its public API can feed a fail-closed static Pages build; publication and synchronization policy remained decisions for this map.
- [Research Integrated Documentation Frameworks](issues/03-research-integrated-documentation-frameworks.md) — Docusaurus provides first-party selectable versions while Astro with Starlight is stronger for static-first local search; removing versioned Documentation made Astro with Starlight the stronger input to the architecture decision.
- [Define the Primary User and Terminal-first Workspace Positioning](issues/04-define-primary-user-and-positioning.md) — position the Early Release for individual Terminal-first Engineers as a workspace for development and operations across local and remote machines, with SSH Client capability but no machine-management or orchestration promise.
- [Define the Published Release Contract](issues/05-define-published-release-contract.md) — publish an atomic four-package GitHub Release from a version-consistent SemVer tag; rebuild the site hourly or manually for latest-stable downloads and rolling Documentation from `otty/main`.
- [Choose the Website and Documentation Architecture](issues/06-choose-website-documentation-architecture.md) — use one static Astro and Starlight site at `otty.run`, stage `otty/main:docs/public/` during each build, generate filesystem navigation and local Pagefind search, and deploy only validated build artifacts.
- [Define the Product Landing Narrative](issues/08-define-product-landing-narrative.md) — use a compact, release-backed Product Landing limited to a proof-led Hero, four evidence-backed Current Capability groups, and Footer, with installation and technical depth delegated to Documentation.
- [Define the Installation and Downloads Experience](issues/09-define-installation-downloads-experience.md) — let authored Documentation control installation content around one static, no-JavaScript-dependent component that renders validated latest-stable package choices and delegates all other releases to GitHub.
- [Define Package Trust and Signing Policy](issues/12-define-package-trust-signing-policy.md) — link directly to GitHub Release assets without checksum or package-signing guarantees; disclose macOS notarization status and document Apple's `Open Anyway` flow.
- [Define the Product Evidence Capture Contract](issues/13-define-product-evidence-capture-contract.md) — accept a maintainer-authored Linux capture set with one static Hero and four still-or-motion capability items, fixed image and video formats, full-frame rendering, accessible motion fallbacks, split repository ownership, and manual freshness responsibility.
- [Establish OTTY's Web Visual Language](issues/10-establish-web-visual-language.md) — use Signal Sequence: a dark terminal-led cyan-and-magenta system with locally hosted Hack, a proof-led Hero, and one four-tab auto-advancing capability sequence without arrow controls, extended conservatively across Starlight and `<LatestDownloads />`.
- [Define the Launch Quality Bar](issues/11-define-launch-quality-bar.md) — gate the relaunch through a maintainer-run manual review of static HTML, accessibility, modern-browser behavior, performance, technical SEO, Product Evidence, rolling Documentation, search, exact downloads, and production cutover while retaining fail-closed build validation.

## Not yet specified

- None.

## Out of scope

- Implementing machine inventory, monitoring, lifecycle management, lab management, or cluster orchestration capabilities beyond the current Terminal-first Workspace.
- Creating new Installation Methods such as Homebrew, Apt repositories, or an install script during the first launch.
- [Define Documentation Information Architecture and Version Policy](issues/07-define-documentation-information-architecture.md) — release-aligned Documentation Version snapshots, preview and archive variants, version-scoped search, and prescribed launch content were removed when the destination changed to rolling Documentation.
- An on-site historical Release Catalog; prereleases and older versions remain available through GitHub Releases.
- Contributor, internal, or API documentation.
- Localization for the first launch.
- User accounts, a runtime application backend, or cloud functionality.
- A full OTTY rebrand.
- A blog, CMS, or product analytics.
- Production implementation within Wayfinder itself.
