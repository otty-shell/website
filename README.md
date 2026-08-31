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

Run the checks and production build against the same explicit Public Documentation Source and live
Published Release data:

```sh
OTTY_SOURCE_DIR=/path/to/otty OTTY_RELEASE_SOURCE=github npm run check
npm test
OTTY_SOURCE_DIR=/path/to/otty OTTY_RELEASE_SOURCE=github npm run build
```

The production build is written to `dist/`. Starlight generates the Documentation routes and
sidebar from the staged filesystem, validated release facts are rendered into static HTML, and then
Pagefind indexes the completed artifact. Documentation staging and generated release data are
ignored by Git. Inspect `dist/` locally with `npm run preview`.
