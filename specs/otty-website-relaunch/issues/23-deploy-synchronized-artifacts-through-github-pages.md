# 23 — Deploy synchronized artifacts through GitHub Pages

**What to build:** Replace repository-root deployment with one fail-closed GitHub Pages pipeline that synchronizes Rolling Documentation and the latest stable Published Release, builds the same production artifact used locally, and gives deployment authority only to the job that receives the completed artifact.

**Blocked by:** 22 — Preview the complete production artifact locally.

**Status:** resolved

- [x] One Pages workflow runs for pushes to website `main`, an hourly schedule, and manual dispatch, with obsolete concurrent runs cancelled.
- [x] A read-only build job checks out the website and OTTY repositories, installs locked dependencies, stages the Public Documentation Source, fetches live release data, validates it, and builds Astro plus Pagefind output through the shared production path.
- [x] The production workflow has no fixture-selection path and cannot deploy when checkout, staging, release validation, Astro, Pagefind, or artifact upload fails.
- [x] The build job uploads only the completed production artifact and has no Pages write or identity permission.
- [x] A dependent deployment job receives the completed artifact, alone holds Pages write and identity permissions, and records the GitHub Pages environment URL.
- [x] The deployed artifact retains the `otty.run` custom-domain declaration and contains no repository sources, staged inputs, or generated release intermediates outside the intended public output.
- [x] Failed synchronization leaves the last successful Pages deployment live, and no automatic rollback service or dedicated rollback artifact system is introduced.

## Comments

Replaced the repository-root deployment job with a live-only synchronization build and a separately
permissioned Pages deployment job. The build checks out both public repositories, runs the shared
locked production path, and uploads only `dist`; deployment waits for that artifact and is the only
job allowed to write Pages or request an identity token. Workflow contract checks cover triggers,
live input selection, fail-closed job ordering, and permission isolation, while the production
artifact check now explicitly excludes repository-only paths and source configuration alongside the
existing `CNAME`, Pagefind, and internal-content assertions.
