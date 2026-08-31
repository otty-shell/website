# Define Documentation Information Architecture and Version Policy

Type: grilling
Status: resolved
Blocked by: 01, 03

## Question

How should user-facing Documentation be organized, what initial content must ship, what constitutes a supported Documentation Version, how are versions created and retired, how should search scope versions, and how should users move between guidance, Current Capabilities, troubleshooting, and release-specific information?

## Answer

Documentation is user-facing, maintained in Git, and versioned for every Published Release tag, including prereleases. A bare tag or draft release does not publish documentation. Current Documentation at `/docs/...` describes the latest stable Published Release; every exact version remains available at `/docs/<version>/...`. The latest prerelease is explicitly selectable as Preview Documentation, while superseded versions become Archived Documentation with a visible unsupported-version warning.

Search is scoped to the selected Documentation Version. Default search covers Current Documentation only; preview and archived content enters results only when that version is selected. Versioned URLs remain permanent. Documentation may receive factual, security, or link corrections after publication, but it must never acquire behavior belonging to another release.

An exact Documentation Version is a release-readiness requirement. Its content and build must be validated before the corresponding Published Release is made public. A later Pages deployment failure does not delete or rewrite the valid release; deployment fails closed and the last good website remains live until retry or reconciliation succeeds.

The launch information architecture is deliberately narrow:

1. **Getting Started** contains only installation through available Installation Methods.
2. **Configuration Reference** documents direct editing of `settings.json` and `quick_launches.json`, including fields, defaults, validation, and examples. It does not mirror application Settings or Quick Launch editor screens.
3. **Terminal Compatibility Reference** documents the escape sequences and terminal behaviors supported by that Published Release.
4. **Shell Integrations** explains that all configured shells can run as ordinary sessions, while Bash and Zsh integration adds semantic command blocks, command/CWD/timing metadata, and Explorer working-directory synchronization.
5. **Troubleshooting** covers installation, shell integration, and platform-specific failures.
6. A global, non-versioned **Release Catalog** presents release notes and downloads once; each Documentation Version links to its matching Published Release.

A complete feature manual for tabs, splits, Explorer, and Quick Launch is not required for the first launch. Framework choice, source location, snapshot mechanics, and build/deployment implementation remain architecture decisions.

Support-state policy for the Early Release is: latest stable is current, latest prerelease is preview, and every other Published Release is archived. Archived Documentation stays readable but carries no support promise.

## Superseded

This answer was superseded when [Define the Published Release Contract](05-define-published-release-contract.md) redrew the destination around rolling Documentation from `otty/main`. Documentation versioning, preview and archive variants, version-scoped search, and a prescribed launch information architecture are no longer part of this effort.
