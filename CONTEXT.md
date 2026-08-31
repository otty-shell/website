# OTTY Website

Shared language for the public product presentation, documentation, and software distribution experience around OTTY.

## Language

**Product Landing**:
The single public-facing page that presents OTTY, its value, and its capabilities.
_Avoid_: Product pages, marketing portal

**Documentation**:
The public area separate from the Product Landing that contains guidance for installing and using OTTY.
_Avoid_: Landing page, product page

**Rolling Documentation**:
The single continuously updated public Documentation set, with no release-specific snapshots or required alignment to a Published Release.
_Avoid_: Documentation Version, Current Documentation, Preview Documentation, Archived Documentation

**Public Documentation Source**:
The explicitly public authoring tree in the OTTY repository whose content becomes Rolling Documentation; internal maintenance and agent documentation is excluded.
_Avoid_: Entire `otty/docs` directory, committed website snapshot, versioned documentation source

**Installation and Downloads**:
The part of Documentation that presents Installation Methods for the latest stable Published Release and delegates other release browsing to GitHub Releases.
_Avoid_: Standalone download site, download landing

**Published Release**:
A version of OTTY made publicly installable through GitHub Release metadata and platform-specific packages; Installation and Downloads exposes the latest stable one directly.
_Avoid_: CI artifact, workflow artifact

**Installation Method**:
A supported way for a user to install OTTY from a Published Release. The initial methods are native packages, while additional methods may be introduced later.
_Avoid_: Download button, release asset

**Current Capability**:
Product behavior available in a Published Release and therefore eligible to be presented as usable now.
_Avoid_: Planned feature, roadmap item

**Product Vision**:
The intended future direction of OTTY, presented separately from Current Capabilities.
_Avoid_: Available feature, current capability

**Configuration Reference**:
The part of Documentation that defines OTTY's JSON configuration files for direct editing outside the application UI.
_Avoid_: Settings screen walkthrough, in-application configuration guide

**Terminal Compatibility Reference**:
The part of Documentation that states which terminal escape sequences and terminal behaviors a Published Release supports.
_Avoid_: Shell Integration guide, feature catalog

**Shell Integration**:
The connection between OTTY and a supported shell that supplies semantic command and working-directory context beyond raw terminal emulation.
_Avoid_: Terminal compatibility, shell support in general

**Product Evidence**:
Screenshots or recordings of real OTTY workflows used to substantiate claims about Current Capabilities.
_Avoid_: Decorative terminal mockup, concept render

**Early Release**:
A Published Release usable by hands-on adopters while OTTY remains under active development and its supported platforms and workflows may still change.
_Avoid_: Stable release, production-ready release, prototype

**Terminal-first Engineer**:
An individual engineer in development, infrastructure, operations, or homelab work who performs a substantial part of their work through terminal workflows.
_Avoid_: Developer-Operator, generic terminal user, organization

**Terminal-first Workspace**:
The current product category for OTTY: a workspace for development and operations across local and remote machines, built around terminal workflows.
_Avoid_: Terminal Workspace, terminal emulator with extras, Operational Hub, terminal task manager

**Quick Launch**:
A user-defined saved command or SSH connection that can be started quickly from OTTY.
_Avoid_: Terminal task, generic target

**SSH Client**:
A Current Capability of OTTY that opens interactive shell sessions on remote machines and can reuse saved connection details through Quick Launch.
_Avoid_: Remote machine management, infrastructure orchestration
