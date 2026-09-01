# 22 — Preview the complete production artifact locally

**What to build:** Give the maintainer one command that prepares and serves the same static artifact boundary used for deployment. It must make Documentation and release inputs explicit, exercise all fail-closed preparation steps, print the local destination, and never substitute a development SPA shell for the completed output.

**Blocked by:** 21 — Make every canonical public route crawlable.

**Status:** resolved

- [x] A package script named `preview:production` requires an absolute `OTTY_DOCUMENTATION_INDEX` path, rejects its absence, and never assumes a repository or Documentation location.
- [x] The command clears and stages the Public Documentation Source, obtains explicitly selected local-fixture or live release input, runs the shared release validator, builds Astro and Pagefind output, serves the completed `dist`, and prints the local URL.
- [x] Fixture selection is explicit and local-only; a final live-input preview cannot silently fall back to it.
- [x] One controlled valid input produces the canonical Product Landing, Documentation index, representative article, Installation and Downloads, navigation, release facts and links, responsive Product Evidence, canonicals, sitemap, and Pagefind assets.
- [x] Contract checks demonstrate failure for missing Documentation, stale staging contamination, missing title, missing or duplicated `LatestDownloads`, unavailable or invalid release data, prerelease-only data, incorrect package matrices, Astro errors, and Pagefind errors.
- [x] The served result is the completed static production artifact, not an Astro development server or client application shell.
- [x] Generated Documentation, release data, image variants, search inputs, and other transient preparation output remain uncommitted.

## Comments

Added `preview:production` as the human-facing composition of the shared production build and
Astro's static `dist/` preview. The command preserves explicit Documentation and release-source
selection, including the local-only fixture guard, and the README distinguishes reproducible fixture
review from the required live-input launch preview. Contract checks now cover missing inputs, Astro
and Pagefind failures, the printed local URL, and a byte-for-byte response from the completed
artifact; the existing preparation, release, and artifact checks cover the remaining fail-closed and
output contracts.
