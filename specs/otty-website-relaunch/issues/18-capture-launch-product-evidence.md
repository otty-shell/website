# 18 — Capture launch Product Evidence

**What to build:** Supply the website-owned Product Evidence set that truthfully demonstrates the latest Published Release: one Hero screenshot and one item for each of the four resolved Current Capability groups. The maintainer owns capture, redaction, visual consistency, accuracy, alternatives, and refresh timing.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] The set contains five real OTTY workflow captures: Hero, terminal workspace tabs and splits, command blocks, Explorer beside a terminal session, and Quick Launch for commands and SSH connections.
- [x] Linux is used as the canonical capture platform, and neither the existing website screenshot nor the prototype placeholder is reused as launch evidence.
- [x] The Hero is an accepted static sRGB PNG at its authored dimensions with authored alternative text and its complete, uncropped composition.
- [x] Each capability uses either a matching screenshot or a silent WebM using VP9 Profile 0 and 8-bit 4:2:0 chroma subsampling at its authored dimensions, frame rate, duration, and file size; a duplicate MP4 is not required, and GIF is not used.
- [x] Every recording includes a separate sRGB PNG poster with matching composition, authored poster alternative text, and a concise description of the demonstrated action.
- [x] Captures contain no secrets or misleading state and substantiate only Current Capabilities available in the Published Release, including SSH as an SSH Client rather than machine management.
- [x] The supplied Hero plus Workspace, Command blocks, Explorer, and Quick Launch recordings are accepted as the launch Product Evidence baseline and handed to the website with authored alternatives, without introducing an evidence manifest, provenance automation, or a duplicate macOS capture set.

## Comments

### Product Evidence handoff

- `hero.png` alt: “OTTY workspace with Explorer beside four terminal panes showing Claude Code, Git history, Cargo configuration, and htop.”
- `workspace-poster.png` alt: “OTTY workspace with Claude Code and htop tabs above three split terminal panes.”
  - Motion description: “A terminal tab is opened, the workspace is divided into multiple panes, and separate Claude Code and htop sessions are started for parallel work.”
- `command-blocks-poster.png` alt: “OTTY terminal with Cargo configuration output grouped into a command block and its action menu open.”
  - Motion description: “A Cargo configuration file is printed, the resulting command block menu is opened, and a command is copied and reused at the prompt.”
- `explorer-poster.png` alt: “OTTY Explorer listing the project files beside three split terminal sessions, including a session in the website directory.”
  - Motion description: “The terminal is split into multiple panes, Explorer is opened, and one session changes directory so the file tree follows its project context.”
- `quick-launch-poster.png` alt: “OTTY Quick Launch editor configuring an SSH connection named laptop while saved SSH and htop entries remain visible.”
  - Motion description: “A saved SSH connection is created in Quick Launch and then opened as an interactive remote Ubuntu shell session.”
