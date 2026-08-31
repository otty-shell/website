# Establish OTTY's Web Visual Language

Type: prototype
Status: resolved
Blocked by: 06, 08, 09, 13

## Question

Which concrete visual system and composed page direction can unify the Product Landing, Astro/Starlight Documentation, and the site-owned `<LatestDownloads />` component inside author-controlled Installation and Downloads content, remain recognizably OTTY, use Product Evidence effectively, avoid reproducing the visual grammar of other terminal-product websites, and fit within Astro and Starlight's public customization seams without sacrificing accessible documentation behavior?

## Resolved Product Evidence input

The visual prototype receives five site-owned, real `16:10` Product Evidence slots: a static `2560×1600` PNG Hero and four capability items that may each be either a `2560×1600` PNG or a short `1920×1200` H.264 MP4 with a PNG poster. The design must preserve each complete authored frame rather than crop it with `cover`, accommodate authored alternative text and motion descriptions, provide pause/play for motion, and replace autoplay with the poster under reduced-motion preferences. The prototype may determine presentation and responsive sizing but must not change this media-input contract.

## Prototype

The throwaway prototype is in [`prototypes/web-visual-language/`](../../../prototypes/web-visual-language/README.md). Run `python prototypes/web-visual-language/serve.py`, then open the printed local URL. One route provides Landing, Documentation, and Installation views for three structurally different directions selected with `?variant=` or the floating switcher:

- `A` — Signal Ledger;
- `B` — Open Canvas;
- `C` — Operator Rail;
- `D` — Signal Sequence, added after selecting A as the preferred base, with more terminal typography and an accessible auto-advancing capability slider controlled by four labeled tabs without previous/next arrows;
- `E` — Signal Matrix, the same refined A direction with a static capability grid instead.

The repeated existing OTTY screenshot is explicitly marked as a local placeholder and is not proposed as launch Product Evidence.

## Answer

Adopt `D — Signal Sequence` as OTTY's web visual language. The confirmed direction is the dark, terminal-led refinement of Signal Ledger with a single capability sequence controlled by four labeled tabs. The prototype is preserved on branch `prototype/otty-web-visual-language` at commit `80b6553ef90d841710ae5931c82b9238396ccf1a`; it is a decision artifact, not production source. The Astro and Starlight implementation must reproduce the selected system using production components and public framework seams rather than promote the prototype code.

The visual foundation is a near-black canvas with a restrained coordinate-grid texture, fine structural rules, and the existing OTTY name and logo. Cyan is the primary signal color and magenta a secondary accent; neither replaces semantic focus, status, or error treatment. Typography is terminal-oriented throughout: self-host [Hack](https://github.com/source-foundry/hack) WOFF2 files, with `Adwaita Mono`, `Liberation Mono`, and generic monospace fallbacks, and no third-party font runtime. Lowercase command-like labels, prompt syntax, indices, and a cursor motif provide character without making body copy read like simulated terminal output. Dense bordered surfaces are preferred to generic rounded cards and decorative shadows.

The Product Landing keeps the already resolved compact narrative:

- A slim header contains the OTTY identity, Documentation, GitHub, and Download navigation.
- The Hero uses a shell prompt, a large terminal-style headline, the canonical positioning statement, primary Download and secondary Documentation actions, concise Linux/macOS and Early Release context, and the complete static `16:10` Hero evidence frame.
- Current Capabilities uses one large `16:10` evidence frame and four labeled tabs: Workspace, Command blocks, Explorer, and Quick Launch. The tabs are the only sequence navigation; there are no previous or next arrows.
- The sequence advances every six seconds while the section is neither hovered nor keyboard-focused. A visible pause/play control remains available. Reduced-motion preferences disable automatic advancement, and capability video continues to obey the separate Product Evidence motion and poster contract.
- The capability items remain static authored content in the built HTML; the sequence is presentation behavior rather than a runtime content source. Exact no-JavaScript fallback and verification criteria belong to the Launch Quality Bar.
- The footer stays compact and functional rather than becoming another marketing section.

On narrow screens the Hero becomes a single column, evidence remains uncropped at `16:10`, the four capability tabs form a readable two-column control, and download actions retain full labels. The design must not turn the desktop composition into horizontal page scrolling.

Documentation keeps Starlight's conventional documentation structure and behavior: header and search, generated sidebar, article column, table of contents, and responsive navigation. OTTY customizes it through public CSS and the smallest necessary component overrides using the same terminal typography, palette, rules, and focus language; the documentation must not imitate the Landing at the cost of scanability. The site-owned `<LatestDownloads />` follows the same system as a compact technical table that keeps platform, method, architecture, filename, size, and direct action legible, with a stacked narrow-screen presentation rather than clipped columns.
