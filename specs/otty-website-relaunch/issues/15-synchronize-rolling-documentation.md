# 15 — Synchronize Rolling Documentation

**What to build:** Make a controlled Public Documentation Source flow end to end into static Rolling Documentation. A maintainer supplies the OTTY source explicitly, the build stages only its public authoring tree, and readers receive conventional Starlight navigation and Documentation-only local search from the completed production artifact.

**Blocked by:** 14 — Establish the Astro/Starlight walking skeleton.

**Status:** ready-for-agent

- [ ] Documentation preparation requires an explicit `OTTY_SOURCE_DIR`, clears the generated staging area before every copy, and stages only the Public Documentation Source rather than internal OTTY material.
- [ ] Missing source input, missing public authoring tree, stale staging contamination, or a page without `title` frontmatter fails preparation or the production build.
- [ ] Markdown, narrowly supported MDX, and relative assets are preserved; only `title` is required, and arbitrary package imports or authored client applications are not accepted as part of the public authoring API.
- [ ] File paths determine routes, `index.md` determines the Documentation index, titles label navigation, alphabetical identifiers provide default order, and supported `sidebar.order` frontmatter can override it without a website-owned navigation manifest.
- [ ] Starlight retains its conventional header, search, sidebar, article, table of contents, skip navigation, and responsive navigation behavior, with articles and ordinary links usable without JavaScript.
- [ ] Pagefind indexes the completed production output, includes Documentation and anchors, excludes the Product Landing, introduces no hosted or runtime search backend, and fails the build when indexing fails.
- [ ] Artifact-level checks demonstrate a valid staged source with nested pages and relative assets appearing once, while unrelated internal content does not appear.
- [ ] Staged Documentation and generated search inputs remain ephemeral and are not committed as a website snapshot.
