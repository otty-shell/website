# 14 — Establish the Astro/Starlight walking skeleton

**What to build:** Replace the hand-authored root deployment with the smallest complete static Astro and Starlight site that a maintainer can install reproducibly, build, and inspect as a production artifact. The walking skeleton must connect the Product Landing, Documentation, and Installation and Downloads routes through ordinary navigation while establishing the artifact-level test seam that later slices can extend.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] A locked dependency installation followed by the production build emits prerendered HTML for `/`, `/docs/`, and `/docs/getting-started/installation/binary/` and does not require SSR, an application backend, a client-side router, or an SPA shell.
- [x] The site is configured for `https://otty.run` without a repository base path, and the completed artifact preserves the custom-domain declaration needed by GitHub Pages.
- [x] Ordinary links connect the OTTY identity and the three canonical routes, and the existing OTTY name and logo assets remain available to the generated site.
- [x] Primary route content and navigation remain present in generated HTML before client JavaScript runs.
- [x] A production-artifact contract check verifies command exit status and externally visible output rather than framework internals, private component state, or CSS class names.
- [x] The legacy repository-root upload is no longer the build model; later tickets can add content and validation behind the established static build boundary.
