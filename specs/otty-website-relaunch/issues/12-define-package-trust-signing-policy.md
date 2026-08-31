# Define Package Trust and Signing Policy

Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

What package-integrity and platform-trust guarantees must the first launch provide, including public checksums, macOS Developer ID signing and notarization, Linux package or repository signatures, user-facing verification guidance, and the treatment of legacy packages that cannot meet the new policy?

## Answer

The first launch intentionally makes no independently verifiable package-integrity or publisher-authenticity guarantee beyond serving direct links to assets hosted on the corresponding GitHub Published Release. The website does not copy, mirror, or proxy package files.

Public checksum files, detached or embedded package signatures, provenance attestations, and immutable-release adoption are not launch requirements. The Published Release contract may still validate release and asset selection for correctness, but the website must not present that operational validation as a package-trust guarantee.

The macOS packages may remain ad-hoc signed. Apple Developer ID signing and notarization are not required and do not block launch. Installation and Downloads must state that OTTY is not currently notarized by Apple and document Apple's supported `System Settings → Privacy & Security → Open Anyway` flow. It must not instruct users to disable Gatekeeper or remove quarantine attributes.

The directly downloaded `.deb` and `.rpm` packages require no additional Linux package or repository signatures. Historical Published Releases remain available through their existing GitHub Release assets under the same policy, without a separate legacy-trust category or retrofitted checksums.

Stronger signing, notarization, integrity, or distribution guarantees may be introduced later, but they are not promises of this relaunch.
