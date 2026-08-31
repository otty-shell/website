# Research Integrated Documentation Frameworks

Type: research
Status: resolved
Blocked by: none

## Question

Using current primary documentation, which maintained framework approaches can support a coherent OTTY Product Landing and Documentation experience with Git-authored content, public Documentation Versions, search, static GitHub Pages deployment, accessible customization, and room for richer product presentation without forcing runtime SSR?

## Answer

Research asset: branch `research/integrated-documentation-frameworks`, commit `4d4520e07f68968c90cfa73c42b1ffed7b791050`, path `docs/research/integrated-documentation-frameworks.md`.

Docusaurus is the safest single-site candidate when publicly selectable supported Documentation Versions are mandatory because it provides a first-party version lifecycle and custom React/MDX pages in one static build. Its main unresolved cost is search ownership: the first-party route is hosted Algolia, while local adapters are community-maintained.

Astro with Starlight is the stronger static-first candidate when minimal client JavaScript, built-in local Pagefind search, and maximum Product Landing freedom matter more than first-party versioning. Choosing it means OTTY owns the complete Documentation Version lifecycle and version-aware search/navigation behavior. VitePress has the same versioning ownership without a compensating advantage for this effort. A split landing/docs stack should remain out of the default architecture.

Documentation Version and search policy must precede architecture selection. If those policies do not clearly select between Docusaurus and Astro with Starlight, a narrowly scoped finalist prototype should make the decision.
