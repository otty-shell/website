# Define the Primary User and Terminal-first Workspace Positioning

Type: grilling
Status: resolved
Blocked by: 01

## Question

Which primary user and present-day job-to-be-done should the Product Landing prioritize, and how should it position OTTY as a Terminal-first Workspace for development and operations across local and remote machines without implying unavailable machine-management or orchestration capabilities?

## Answer

The Primary User is an individual Terminal-first Engineer: someone in development, infrastructure, operations, or homelab work who performs a substantial part of their work through terminal workflows. This is an internal audience definition, not a job title that public copy must use.

The canonical current category is Terminal-first Workspace. The core positioning is:

> OTTY is a terminal-first workspace for development and operations across local and remote machines.

The present-day job is grounded in a concrete scenario: the user works in the terminal across multiple projects, browses project files, arranges and manipulates terminal sessions, and keeps commands and SSH connections in Quick Launch for fast reuse. OTTY's SSH Client is a Current Capability; machine inventory, monitoring, lifecycle management, lab management, and orchestration are not implied by “operations across machines.”

OTTY is presented as an Early Release for hands-on adopters, with maturity shown separately from the core positioning. Operational Hub is not part of the positioning or Product Vision, and the Product Landing does not need a separate vision block. Future capabilities deepen the Terminal-first Workspace category and may appear in a clearly labelled roadmap.

Public claims must keep Published Release capabilities, unreleased behavior on `main`, and roadmap items visibly separate.
