# 17 — Consume the latest stable Published Release

**What to build:** Connect the validated Installation and Downloads experience to GitHub Releases at build time. A successful live-input build selects the latest published stable release and renders the same static result as the fixture path, while invalid or unavailable upstream data stops the build before anything can be deployed.

**Blocked by:** 16 — Render Installation and Downloads from validated release data.

**Status:** ready-for-agent

- [ ] The build reads GitHub's public Releases API, ignores drafts and prereleases when selecting stable, and validates the selected release through the same contract used by the local fixture.
- [ ] Missing stable releases, prerelease-only input, malformed metadata, an invalid package matrix, API failures, and generated-data failures produce a non-zero build before deployment.
- [ ] The deleted prerelease and bare tags without a GitHub Release can never become the selected Published Release, and no transitional exception is added for a non-compliant RPM filename.
- [ ] Release facts are written only as ephemeral typed build data and include version, publication date, release-notes destination, all-releases destination, and complete Installation Method records.
- [ ] Browsers receive release facts and direct links in prerendered HTML and never call the GitHub API at runtime.
- [ ] Production input selection cannot use the local fixture, while controlled contract checks can exercise successful and failing API responses without depending on mutable live state.
