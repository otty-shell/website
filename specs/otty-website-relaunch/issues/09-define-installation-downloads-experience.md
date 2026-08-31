# Define the Installation and Downloads Experience

Type: grilling
Status: resolved
Blocked by: 05, 06

## Question

How should `/docs/install/` combine Public Documentation Source content with the validated build-time latest-stable release data to present Installation Methods, platform and architecture choices, direct GitHub Release asset links, unsupported combinations, macOS notarization status and `Open Anyway` guidance, the `All releases` hand-off to GitHub, and future Installation Methods so users can select and install the correct build?

## Answer

The Public Documentation Source owns `/docs/install/` through `otty/docs/public/install.mdx`. Its author controls all prose, commands, installation instructions, compatibility statements, and the ordering and presentation of the surrounding material. The website does not generate or prescribe Linux package commands, DMG instructions, or other explanatory content. The page must include exactly one stable website-provided `<LatestDownloads />` MDX component; a missing page or missing component is a build error.

`<LatestDownloads />` owns only validated Published Release facts and the download-selection interface. It renders the latest stable version and publication date, a link to that release's notes, and one `All releases` link that delegates older versions and prereleases to GitHub. It renders every currently available Installation Method with a user-facing platform label, architecture, package format, exact asset filename, rounded file size, and direct `browser_download_url`. Release-specific values come exclusively from the generated release JSON and are not duplicated in authored content.

The first-launch methods are grouped into Linux and macOS while remaining simultaneously visible and usable without JavaScript:

- Debian or Ubuntu-style Linux on Intel or AMD 64-bit (`x86-64`) uses the validated `.deb` asset;
- RPM-based Linux on Intel or AMD 64-bit (`x86-64`) uses the validated `.rpm` asset without promising a particular distribution or version;
- macOS on Apple Silicon uses the validated `aarch64-apple-darwin` DMG;
- macOS on an Intel-based Mac uses the validated `x86_64-apple-darwin` DMG.

Optional client-side platform detection may visually emphasize a likely choice, but it must never hide methods, redirect the user, or become authoritative. Concise architecture help explains Apple Silicon as M1 or newer, distinguishes Intel Macs, identifies Linux `x86-64` as Intel or AMD 64-bit, and states that `arm64` or `aarch64` Linux has no package. Windows and Linux ARM64 are shown as currently unavailable without a `Coming soon` promise or disabled download control.

The page identifies the selected release only as `Latest stable` with its version; it does not add an `Early Release` badge. Compatibility details beyond the component's validated platform, format, and architecture mapping remain authored Documentation because GitHub Release metadata cannot prove operating-system or distribution compatibility. The website must not infer such promises from filenames.

Package Trust and Signing Policy still requires the authored Installation and Downloads content to state that OTTY is not notarized by Apple and document Apple's supported first-launch `System Settings → Privacy & Security → Open Anyway` flow. The author owns the wording and presentation. The website adds no generic checksum or signature warning and never claims that GitHub hosting independently verifies package integrity or publisher identity.

Future Installation Methods join the same experience only when they work. A method may resolve to a Published Release asset, a command, or an external official destination, but placeholders, disabled controls, and `Coming soon` methods are not rendered. The presentation model must accommodate these additions without changing the meaning of an Installation Method or requiring a historical Release Catalog.

The currently published `v0.1.0` cannot be grandfathered into the website because its RPM filename does not match the strict Published Release matrix. Before the rebuilt website launches, `v0.1.0` must be atomically recreated through the new release pipeline with the exact four contracted asset names. The already accepted destructive-rerun policy applies; no transitional filename alias or validation exception is added. Any invalid asset matrix, missing Installation and Downloads page, or missing download component stops deployment and leaves the last successful website live.
