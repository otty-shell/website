# Define the Published Release Contract

Type: grilling
Status: resolved
Blocked by: 01, 02, 12

## Question

What minimal cross-repository contract must the `otty` release pipeline publish and the website consume for every Published Release, using GitHub Releases as the durable source and linking directly to their assets, including the exact package matrix, tag/version consistency, stable and prerelease semantics, asset discovery and naming, idempotent reruns, release notes, historical availability, website rebuild triggering, and failure behavior, without requiring a separate manifest, checksums, package signatures, attestations, or immutable-release migration?

## Answer

GitHub Releases is the durable source for Published Releases and package files. A push of a strict `v<SemVer>` tag starts automatic release production; a manual workflow with an existing tag supports a complete rerun. Before building, the pipeline requires the tag without its leading `v`, the repository `VERSION`, and the OTTY Cargo package version to match exactly. A SemVer prerelease suffix sets GitHub `prerelease: true`; a normal SemVer version becomes the latest stable release.

Every Published Release has one atomic four-package matrix:

- `otty_<version>-amd64.deb`, built through the Ubuntu 20.04-compatible path for Debian-family Linux on x86-64;
- `otty_<version>-x86_64.rpm` for RPM-family Linux on x86-64;
- `otty_<version>-aarch64-apple-darwin.dmg` for Apple Silicon;
- `otty_<version>-x86_64-apple-darwin.dmg` for Intel macOS.

The pipeline creates the GitHub Release as a draft, builds all four packages, uploads the exact expected filenames, and publishes only when the complete matrix succeeds. GitHub-generated release notes are sufficient. There is no required manifest, checksum file, package signature, provenance attestation, or immutable-release policy.

A rerun is destructive by design: it may delete any existing GitHub Release for the tag, including a published one, and recreate the release and all four assets as though it had not existed. The tag remains the release identity. Temporary download unavailability, a new GitHub release ID, and reset download counts are accepted consequences.

The website build reads GitHub's public Releases API. It exposes direct `browser_download_url` links only for the latest stable Published Release after validating the exact four-asset naming matrix. It does not maintain an on-site historical Release Catalog; one `All releases` link delegates prereleases and older versions to the repository's GitHub Releases page. The deleted `v0.1.0-beta1` release needs no migration, and bare Git tags without a GitHub Release are ignored.

Documentation is independent of Published Releases. Its canonical source is rolling content on `otty/main`; it has no release-aligned snapshots, required section set, feature-availability guarantee, preview, archive, or version-scoped search. The maintainer owns its content and warnings, while the website is responsible for rendering the supplied material correctly.

One website pipeline handles website-source changes, an hourly scheduled synchronization, and manual `workflow_dispatch`. Each run fetches the latest stable Published Release and current Documentation from `otty/main`, then builds static GitHub Pages output. There is no cross-repository dispatch, GitHub App, or cross-repository credential. If the API, Documentation ingestion, asset-matrix validation, or site build fails, deployment stops and the last successful Pages deployment remains live.
