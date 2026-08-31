# 22 — Preview the complete production artifact locally

**What to build:** Give the maintainer one command that prepares and serves the same static artifact boundary used for deployment. It must make Documentation and release inputs explicit, exercise all fail-closed preparation steps, print the local destination, and never substitute a development SPA shell for the completed output.

**Blocked by:** 21 — Make every canonical public route crawlable.

**Status:** ready-for-agent

- [ ] A package script named `preview:production` requires `OTTY_SOURCE_DIR`, rejects its absence, and never assumes a sibling checkout location.
- [ ] The command clears and stages the Public Documentation Source, obtains explicitly selected local-fixture or live release input, runs the shared release validator, builds Astro and Pagefind output, serves the completed `dist`, and prints the local URL.
- [ ] Fixture selection is explicit and local-only; a final live-input preview cannot silently fall back to it.
- [ ] One controlled valid input produces the canonical Product Landing, Documentation index, representative article, Installation and Downloads, navigation, release facts and links, responsive Product Evidence, canonicals, sitemap, and Pagefind assets.
- [ ] Contract checks demonstrate failure for missing Documentation, stale staging contamination, missing title, missing or duplicated `LatestDownloads`, unavailable or invalid release data, prerelease-only data, incorrect package matrices, Astro errors, and Pagefind errors.
- [ ] The served result is the completed static production artifact, not an Astro development server or client application shell.
- [ ] Generated Documentation, release data, image variants, search inputs, and other transient preparation output remain uncommitted.
