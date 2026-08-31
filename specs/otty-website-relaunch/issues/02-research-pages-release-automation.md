# Research GitHub Pages and Release Automation Constraints

Type: research
Status: resolved
Blocked by: none

## Question

Using primary GitHub documentation, what constraints and supported mechanisms govern an OTTY-release-to-GitHub-Pages workflow that publishes platform packages and metadata, handles prereleases and historical versions, provides integrity information, and automatically rebuilds the website safely and reliably?

## Answer

Research asset: branch `research/github-pages-release-automation`, commit `7e74052e66af0167453c04511d0a7f062d9e5f94`, path `docs/research/github-pages-release-automation.md`.

GitHub Releases should be the durable source for packages and release metadata; transient Actions artifacts and reconstructed filenames are unsuitable interfaces. The application pipeline should assemble and validate a draft containing packages, a versioned machine-readable manifest, and checksums before publishing it atomically. The website should ingest the paginated published-release catalog at build time, validate it, generate static output, and fail closed so a broken release or API response cannot replace the last good Pages deployment.

Cross-repository rebuilding should use `workflow_dispatch` authenticated by a short-lived, repository-scoped GitHub App installation token. Stable and prerelease semantics, idempotent reruns, legacy-release migration, package trust, immutable-release rollout, and operator recovery remain policy decisions. The current site is stale, the existing package workflow does not publish Releases, and the current macOS packages are ad-hoc signed rather than Developer ID signed and notarized.
