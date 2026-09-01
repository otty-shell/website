# 17 — Consume the latest stable Published Release

**What to build:** Connect the validated Installation and Downloads experience to GitHub Releases at build time. A successful live-input build selects the latest published stable release and renders the same static result as the fixture path, while invalid or unavailable upstream data stops the build before anything can be deployed.

**Blocked by:** 16 — Render Installation and Downloads from validated release data.

**Status:** resolved

- [x] The build reads GitHub's public Releases API, ignores drafts and prereleases when selecting stable, and validates the selected release through the same contract used by the local fixture.
- [x] Missing stable releases, prerelease-only input, malformed metadata, an invalid package matrix, API failures, and generated-data failures produce a non-zero build before deployment.
- [x] The deleted prerelease and bare tags without a GitHub Release can never become the selected Published Release, and no transitional exception is added for a non-compliant RPM filename.
- [x] Release facts are written only as ephemeral typed build data and include version, publication date, release-notes destination, all-releases destination, and complete Installation Method records.
- [x] Browsers receive release facts and direct links in prerendered HTML and never obtain Published Release facts from the GitHub API at runtime; the Product Landing's independent public star-count enhancement is outside this release-data boundary.
- [x] Production input selection cannot use the local fixture, while controlled contract checks can exercise successful and failing API responses without depending on mutable live state.

## Comments

Implemented build-time consumption of GitHub's authoritative latest-release endpoint using the
same selector, validator, typed generated-data file, and stage manifest as the local fixture. The
fixture remains explicit and is rejected in CI. Controlled API and complete production-build checks
cover successful prerendering plus HTTP, malformed-input, prerelease, package-matrix, and generated-
data failures without depending on mutable live Published Releases.
