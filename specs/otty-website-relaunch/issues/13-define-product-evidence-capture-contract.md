# Define the Product Evidence Capture Contract

Type: grilling
Status: resolved
Blocked by: 01, 08

## Question

What reproducible real workflows, supported product version, sample data, capture states, visual consistency, redaction rules, asset formats, ownership, and refresh triggers must define the screenshot and recording set used as Product Evidence by the Product Landing and Documentation?

## Answer

The Product Landing uses a canonical set of five pieces of real Product Evidence: one static Hero screenshot and one dedicated media item for each of the four Current Capability groups defined by the Product Landing Narrative. A capability item may be either a screenshot or a short recording. Decorative mockups do not qualify, and neither of the existing repository screenshots is part of the new canonical set.

The maintainer owns the content and capture process. The contract does not prescribe sample data, terminal commands, fixture repositories, capture states, a capture harness, or a reproducibility workflow. The maintainer is responsible for ensuring that the material is accurate, contains no sensitive information, and remains editorially synchronized with the latest Published Release. The website performs no release-version, tag, commit, platform, provenance, or freshness validation; it stores no evidence manifest or sidecar metadata and does not block a build because evidence has not changed with a release.

Linux is the single canonical capture platform for the Product Landing. A complete duplicate set for macOS is not required. Platform-specific screenshots may still be authored within Documentation when they are useful for platform-specific guidance.

All five Landing items use a consistent visual capture setup chosen by the maintainer: the same OTTY theme, terminal font and size, interface scale, and `16:10` frame. The site preserves the entire authored frame and must not use automatic `cover` cropping. When a capability needs a closer composition, the maintainer supplies that crop as the source asset.

### Static image contract

- Hero is always a static screenshot.
- A screenshot is an sRGB PNG at `2560×1600`.
- Each screenshot has required authored alternative text.
- The Astro build produces responsive AVIF and WebP variants while retaining PNG as the fallback; these generated variants are build outputs rather than separately maintained source assets.

### Motion contract

- A capability recording is an MP4 using H.264 at `1920×1200`, 30 FPS, without an audio track.
- A recording is at most eight seconds and at most 5 MB. GIF is not an accepted evidence format.
- Every recording has a separate sRGB PNG poster with the same `16:10` composition, authored alternative text for the poster, and a short authored text description of the demonstrated action.
- The site plays recordings muted, inline, automatically, and in a loop, while providing a pause/play control.
- When the visitor prefers reduced motion, the site does not autoplay the recording and presents the poster instead.

Landing evidence and its authored text live in the website repository. The maintainer replaces an item manually whenever it is considered inaccurate or visually stale; there is no automatic refresh trigger or cross-repository synchronization for this media.

Documentation evidence lives in the `otty` repository. It follows the same accepted image and recording formats but is an independent set: it does not need to duplicate the Landing evidence and is not synchronized with it automatically.
