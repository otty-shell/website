# Choose the Website and Documentation Architecture

Type: grilling
Status: resolved
Blocked by: 02, 03, 05

## Question

Which framework, cross-repository content-ingestion, rendering, search, and deployment architecture best satisfies the OTTY Product Landing and rolling Documentation requirements while the first launch pulls Documentation from `otty/main`, reads the latest stable Published Release at build time, supports website-source, hourly, and manual rebuilds, and produces fully static GitHub Pages output, and what explicit trade-offs justify that choice?

## Answer

Use one fully static Astro site with the Starlight integration. A custom Astro page serves the Product Landing at `/`; Starlight serves rolling Documentation at `/docs/`; and the Getting Started Binary guide provides Installation and Downloads at `/docs/getting-started/installation/binary/`. The canonical production origin remains `https://otty.run`, configured as Astro's `site` without a repository `base`, with the custom domain preserved through `public/CNAME`. A separate documentation application, subdomain, runtime server, and finalist prototype are unnecessary.

During each website build, the caller supplies `OTTY_DOCUMENTATION_INDEX` as the absolute path to the intended Public Documentation Source `index.md`. The website clears a generated staging directory and copies the index file's parent tree into `src/content/docs/docs/`; it never derives the source from an OTTY repository root or a hard-coded Documentation subdirectory. CI checks out the public `otty` repository at `main` and passes the current index path explicitly, while local development supplies any absolute index path through the same contract. The staged copy is never committed. This intentionally uses Starlight's standard `docsLoader()` and `docsSchema()` rather than a Git submodule, a custom remote content loader, or a committed cross-repository snapshot.

The Public Documentation Source may contain Markdown and MDX. Every page requires `title` frontmatter; all other metadata is optional. File paths define routes, `index.md` defines the documentation-area index, and relative assets must remain within the public source tree so staging preserves them. Markdown content is otherwise editorially unconstrained. MDX support is limited to Starlight components and components explicitly exposed as a stable website API; arbitrary npm imports and client applications are not part of the first-launch contract.

Starlight generates Documentation navigation from the staged filesystem tree. Page titles provide navigation labels, alphabetical file IDs provide the default order, and authors may override ordering with `sidebar.order` frontmatter. No duplicate website-owned navigation manifest is maintained. Starlight's built-in Pagefind integration provides local static search over Documentation only; the Product Landing is excluded from the search index, and no hosted search service or runtime search backend is introduced.

A build-time release-data step calls GitHub's public Releases API, selects the latest stable Published Release, verifies strict SemVer and the exact four-asset matrix from the Published Release contract, and writes temporary typed JSON for the static site build. Product Landing and Installation and Downloads presentation may consume this data, while browsers never obtain Published Release facts from the GitHub API directly. The Product Landing may independently refresh the public repository star count at runtime and retains `0` when that request is unavailable or invalid. The exact Installation and Downloads composition remains a decision for ticket 09.

One GitHub Pages workflow runs on pushes to `website/main`, an hourly schedule, and manual `workflow_dispatch`. Its read-only build job checks out both repositories, installs locked dependencies, stages Documentation, generates and validates release data, and runs `astro build`. A separate dependent deployment job receives only the completed `dist` artifact and holds the Pages write permissions. Concurrent obsolete runs are cancelled. Any checkout, ingestion, validation, search-index, or build failure prevents deployment and leaves the last successful site live.

The accepted trade-offs are an extra ephemeral staging step, a required `title` field, a deliberately narrow MDX component contract, synchronization latency of up to one hour, and the possibility that the public site temporarily remains on its last successful build when an upstream input is invalid. These costs are preferable to maintaining a custom loader or submodule, accepting runtime infrastructure, or coupling Documentation to release versions. Docusaurus is rejected because its first-party version lifecycle is no longer needed and local static search would add a community-maintained integration, while Astro with Starlight supplies the required landing-page freedom, static rendering, and Pagefind search in one maintained stack.
