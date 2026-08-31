# 16 — Render Installation and Downloads from validated release data

**What to build:** Let an installer open the authored Installation and Downloads page and choose any current native package from static HTML whose release facts have passed the Published Release contract. Use an explicit local release fixture to make the complete validation and rendering path reproducible before a compliant live release exists.

**Blocked by:** 15 — Synchronize Rolling Documentation.

**Status:** ready-for-agent

- [ ] The release contract accepts a latest stable strict `v<SemVer>` Published Release only when its version and exact required deb, rpm, Apple Silicon DMG, and Intel DMG filenames agree and every required method has one direct GitHub asset URL.
- [ ] Contract checks cover stable selection, drafts and prereleases, invalid versions, missing or mismatched assets, duplicate required assets, dates, byte sizes, release notes, and the GitHub Releases destination; unexpected assets never become Installation Methods.
- [ ] A compliant local-only fixture passes through the same selector, validator, and generated typed-data boundary as non-fixture input and must be chosen explicitly for local development.
- [ ] The authored Installation and Downloads page must exist and contain exactly one website-provided `LatestDownloads` component; a missing or duplicated component fails the build.
- [ ] Generated HTML shows Latest stable version, publication date, release notes, one All releases link, and all four initial Installation Methods with platform, architecture, format, exact filename, rounded size, and direct link before JavaScript runs.
- [ ] Linux and macOS methods remain simultaneously visible, reflow without clipping on narrow screens, and optional platform emphasis can neither hide choices nor select or redirect authoritatively.
- [ ] Authored guidance distinguishes Apple Silicon, Intel Mac, and Linux x86-64, states that Windows and Linux ARM64 are unavailable without disabled controls or Coming soon promises, and accurately documents the macOS Open Anyway flow without unsafe Gatekeeper instructions.
- [ ] The experience makes no checksum, signature, publisher-verification, inferred compatibility, mirroring, or proxying claim.
- [ ] The Installation Method model can later represent a release asset, command, or official external destination without rendering unavailable future placeholders.
