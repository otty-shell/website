# OTTY Website

This is the source code of the OTTY workspace website.

## Local development

Use Node.js 22.12 or newer and install the locked dependency graph:

```sh
npm ci
```

Set `OTTY_SOURCE_DIR` to an explicit OTTY checkout containing the Public Documentation Source at
`docs/public/`. For reproducible local development, explicitly select the local-only release fixture
with `OTTY_RELEASE_SOURCE=fixture`, then start the development server:

```sh
OTTY_SOURCE_DIR=/path/to/otty OTTY_RELEASE_SOURCE=fixture npm run dev
```

Set `OTTY_RELEASE_SOURCE=github` to consume the latest stable Published Release from the public
`otty-shell/otty` GitHub Releases API instead. `GITHUB_TOKEN` is optional for this public request and
can be supplied to use an authenticated rate limit. The fixture is rejected in CI so production
builds cannot select it.

Every preparation clears `src/content/docs/docs/` before staging that public tree. The generated
staging directory is ignored by Git and must not be committed as a Documentation snapshot.

Public pages may use Markdown or MDX and must define non-empty `title` frontmatter. The public tree
must include `install.mdx` with exactly one unconfigured `<LatestDownloads />`. MDX imports are
limited to `@astrojs/starlight/components`; arbitrary package imports, scripts, and client directives
are rejected during preparation.

## Production artifact

Prepare and serve the complete production artifact with one command. Select the local-only release
fixture explicitly for a reproducible local review:

```sh
OTTY_SOURCE_DIR=/path/to/otty OTTY_RELEASE_SOURCE=fixture npm run preview:production
```

For the final launch preview, select the live Published Release input explicitly instead. This mode
never falls back to the fixture:

```sh
OTTY_SOURCE_DIR=/path/to/otty OTTY_RELEASE_SOURCE=github npm run preview:production
```

`preview:production` clears and stages the Public Documentation Source, validates the selected
release input, builds Astro and Pagefind output, and then prints the local URL serving the completed
`dist/`. It does not start the Astro development server.

Run checks or produce the artifact without serving it against the same explicit inputs:

```sh
OTTY_SOURCE_DIR=/path/to/otty OTTY_RELEASE_SOURCE=github npm run check
npm test
OTTY_SOURCE_DIR=/path/to/otty OTTY_RELEASE_SOURCE=github npm run build
```

The production build is written to `dist/`. Starlight generates the Documentation routes and
sidebar from the staged filesystem, validated release facts are rendered into static HTML, and then
Pagefind indexes the completed artifact. Documentation staging and generated release data are
ignored by Git, as are generated image variants, Pagefind assets, and the rest of `dist/`.

## Automated deployment

The GitHub Pages workflow runs for pushes to website `main`, once per hour, and on manual dispatch.
Its read-only build job checks out the website and `otty-shell/otty` `main`, installs the locked npm
dependency graph, and runs the same `npm run build` production path with live GitHub Release input.
Only the completed `dist/` output is uploaded as the Pages artifact.

A separate dependent job owns the Pages and identity permissions and deploys that artifact. If
synchronization, validation, Astro, Pagefind, or upload fails, deployment does not run and the last
successful site remains live. Recover a flawed deployment with a normal source fix or revert and a
workflow rerun; there is no separate rollback artifact path.
