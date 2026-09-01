# 15 — Synchronize Rolling Documentation

**What to build:** Make a controlled Public Documentation Source flow end to end into static Rolling Documentation. A maintainer supplies the absolute path to its index explicitly, the build stages only that selected tree, and readers receive conventional Starlight navigation and Documentation-only local search from the completed production artifact.

**Blocked by:** 14 — Establish the Astro/Starlight walking skeleton.

**Status:** resolved

- [x] Documentation preparation requires an explicit absolute `OTTY_DOCUMENTATION_INDEX` path, clears the generated staging area before every copy, and stages only the selected index file's parent tree rather than internal OTTY material.
- [x] Missing source input, missing public authoring tree, stale staging contamination, or a page without `title` frontmatter fails preparation or the production build.
- [x] Markdown, narrowly supported MDX, and relative assets are preserved; only `title` is required, and arbitrary package imports or authored client applications are not accepted as part of the public authoring API.
- [x] File paths determine routes, `index.md` determines the Documentation index, titles label navigation, alphabetical identifiers provide default order, and supported `sidebar.order` frontmatter can override it without a website-owned navigation manifest.
- [x] Starlight retains its conventional header, search, sidebar, article, table of contents, skip navigation, and responsive navigation behavior, with articles and ordinary links usable without JavaScript.
- [x] Pagefind indexes the completed production output, includes Documentation and anchors, excludes the Product Landing, introduces no hosted or runtime search backend, and fails the build when indexing fails.
- [x] Artifact-level checks demonstrate a valid staged source with nested pages and relative assets appearing once, while unrelated internal content does not appear.
- [x] Staged Documentation and generated search inputs remain ephemeral and are not committed as a website snapshot.

## Comments

Implemented an explicit absolute `OTTY_DOCUMENTATION_INDEX` preparation command, exact staging-manifest
verification, filesystem-generated Starlight Documentation, and Documentation-only Pagefind output.
The artifact contract tests cover nested Markdown and MDX, relative assets, navigation order,
internal-content exclusion, anchor search, and Product Landing exclusion.
