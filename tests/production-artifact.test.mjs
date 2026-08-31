import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { writeTestFile } from "./helpers/filesystem.mjs";
import { runNpmScriptAsync } from "./helpers/process.mjs";
import { withReleaseApi } from "./helpers/release-api.mjs";
import { readStableReleaseFixture } from "./helpers/release-fixture.mjs";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const artifactPath = join(repositoryRoot, "dist");
const generatedPath = join(repositoryRoot, ".generated");
const generatedReleaseDataPath = join(generatedPath, "release-data.json");
const releaseDataStageManifestPath = join(generatedPath, "release-data-stage.json");

function readArtifact(relativePath) {
  return readFileSync(join(artifactPath, relativePath), "utf8");
}

function htmlBeforeClientJavaScript(relativePath) {
  return readArtifact(relativePath).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

function listFiles(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

function createPublicDocumentationSource() {
  const ottySource = mkdtempSync(join(tmpdir(), "otty-website-artifact-"));
  const publicSource = join(ottySource, "docs", "public");

  writeTestFile(
    join(publicSource, "index.md"),
    `---
title: Documentation
---

OTTY Rolling Documentation is synchronized from its public authoring tree.

## Glimmerquartz synchronization

This distinctive section verifies local search and anchor destinations.

[Read the nested operations guide](./04-guides/).
`,
  );
  writeTestFile(
    join(publicSource, "01-basics.md"),
    "---\ntitle: Alphabetical Basics\n---\n\nStart with these basics.\n",
  );
  writeTestFile(
    join(publicSource, "02-reference.md"),
    "---\ntitle: Alphabetical Reference\n---\n\nContinue into the reference.\n",
  );
  writeTestFile(
    join(publicSource, "03-priority.md"),
    "---\ntitle: Priority Guide\nsidebar:\n  order: 1\n---\n\nAn author-prioritized page.\n",
  );
  writeTestFile(
    join(publicSource, "04-guides", "index.md"),
    "---\ntitle: Nested Operations\n---\n\n![Terminal map](./terminal-map.svg)\n",
  );
  writeTestFile(
    join(publicSource, "04-guides", "terminal-map.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><title>Terminal map</title><path d="M0 0h4v4H0z"/></svg>\n',
  );
  writeTestFile(
    join(publicSource, "05-components.mdx"),
    "---\ntitle: Component Guidance\n---\n\nimport { Aside } from '@astrojs/starlight/components';\n\n<Aside>Approved Starlight MDX remains available.</Aside>\n",
  );
  writeTestFile(
    join(publicSource, "install.mdx"),
    `---
title: Installation and Downloads
---

Choose the package that matches your computer. Apple Silicon means an M1 or newer Mac; Intel Mac
packages are for Intel-based Macs. Linux x86-64 means an Intel or AMD 64-bit computer.

<LatestDownloads />

Windows is currently unavailable. Linux ARM64 (arm64 or aarch64) is currently unavailable.

## Opening OTTY on macOS

OTTY is not notarized by Apple. After trying to open OTTY once, open **System Settings → Privacy &
Security**, find the notice that OTTY was blocked, select **Open Anyway**, then confirm **Open**.

[Return to Documentation](/docs/) or the [OTTY Product Landing](/).
`,
  );
  writeTestFile(
    join(ottySource, "docs", "internal", "secrets.md"),
    "artifact-internal-marker\n",
  );

  return ottySource;
}

function createBuildEnvironment(ottySource, releaseEnvironment) {
  const environment = {
    ...process.env,
    OTTY_SOURCE_DIR: ottySource,
    ...releaseEnvironment,
  };
  delete environment.CI;
  delete environment.GITHUB_ACTIONS;
  return environment;
}

async function searchProductionIndex(query) {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (resource, options) => {
    const resourceUrl =
      resource instanceof URL
        ? resource
        : new URL(typeof resource === "string" ? resource : resource.url);

    if (resourceUrl.protocol === "file:") {
      return new Response(readFileSync(fileURLToPath(resourceUrl)));
    }

    return originalFetch(resource, options);
  };

  try {
    const pagefindUrl = pathToFileURL(join(artifactPath, "pagefind", "pagefind.js"));
    pagefindUrl.searchParams.set("test", `${Date.now()}-${query}`);
    const pagefind = await import(pagefindUrl.href);
    await pagefind.init();
    const search = await pagefind.search(query);
    return {
      ...search,
      results: await Promise.all(search.results.map((result) => result.data())),
    };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("the production artifact contains synchronized Documentation-only search", async () => {
  rmSync(artifactPath, { recursive: true, force: true });
  const ottySource = createPublicDocumentationSource();

  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const localBuildEnvironment = createBuildEnvironment(ottySource, {
    OTTY_RELEASE_SOURCE: "fixture",
  });
  const build = spawnSync(npm, ["run", "build"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: localBuildEnvironment,
  });

  rmSync(ottySource, { recursive: true, force: true });

  assert.equal(
    build.status,
    0,
    `production build failed\n\nstdout:\n${build.stdout}\n\nstderr:\n${build.stderr}`,
  );

  const landing = htmlBeforeClientJavaScript("index.html");
  const documentation = htmlBeforeClientJavaScript("docs/index.html");
  const installation = htmlBeforeClientJavaScript("docs/install/index.html");
  const nestedGuide = htmlBeforeClientJavaScript("docs/04-guides/index.html");

  assert.match(landing, /<h1[^>]*>\s*OTTY\s*<\/h1>/);
  assert.match(
    landing,
    /OTTY is a terminal-first workspace for development and operations across local and remote machines\./,
  );
  assert.equal(landing.match(/<header\b/g)?.length, 1);
  assert.equal(landing.match(/<main\b/g)?.length, 1);
  assert.equal(landing.match(/<section\b/g)?.length, 2);
  assert.equal(landing.match(/<footer\b/g)?.length, 1);

  const landingHeader = landing.match(/<header\b[\s\S]*?<\/header>/)?.[0];
  assert.ok(landingHeader);
  assert.match(landingHeader, /href="\/"[^>]*>[\s\S]*?OTTY/);
  assert.match(landingHeader, /href="\/docs\/"[^>]*>Documentation/);
  assert.match(landingHeader, /href="https:\/\/github\.com\/otty-shell\/otty"[^>]*>GitHub/);
  assert.match(
    landingHeader,
    /href="\/docs\/install\/"[^>]*>Installation and Downloads/,
  );

  const landingMain = landing.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(landingMain);
  assert.match(landingMain, /Early Release/);
  assert.match(landingMain, /Linux/);
  assert.match(landingMain, /macOS/);
  assert.match(landingMain, /href="\/docs\/install\/"[^>]*>[\s\S]*?Download OTTY/);
  assert.match(landingMain, /href="\/docs\/"[^>]*>[\s\S]*?Read docs/);

  const capabilityContent = [
    [
      "Shape your terminal workspace",
      "Arrange tabs and splits so parallel sessions stay visible without becoming one long stream.",
    ],
    [
      "Work with command blocks",
      "Treat commands and output as semantic units you can identify, select, and reuse.",
    ],
    [
      "Keep project files in reach",
      "Keep Explorer beside the shell and aligned with the focused session's current directory.",
    ],
    [
      "Launch commands and connections",
      "Start saved commands and open interactive SSH Client sessions without rebuilding the same context each time.",
    ],
  ];
  let previousCapabilityPosition = -1;
  for (const [title, benefit] of capabilityContent) {
    const capabilityPosition = landing.indexOf(title);
    assert.ok(capabilityPosition > previousCapabilityPosition);
    const benefitPattern = benefit
      .split("'")
      .map((segment) => segment.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("(?:'|&#39;)");
    assert.match(landing, new RegExp(benefitPattern));
    previousCapabilityPosition = capabilityPosition;
  }

  const evidenceAlternatives = [
    "OTTY workspace with Explorer beside four terminal panes showing Claude Code, Git history, Cargo configuration, and htop.",
    "OTTY workspace with Claude Code and htop tabs above three split terminal panes.",
    "OTTY terminal with Cargo configuration output grouped into a command block and its action menu open.",
    "OTTY Explorer listing the project files beside three split terminal sessions, including a session in the website directory.",
    "OTTY Quick Launch editor configuring an SSH connection named laptop while saved SSH and htop entries remain visible.",
  ];
  for (const alternative of evidenceAlternatives) {
    assert.match(landing, new RegExp(`alt="${alternative.replaceAll(".", "\\.")}"`));
  }
  assert.equal(landing.match(/<picture\b/g)?.length, 5);
  assert.equal(landing.match(/type="image\/avif"/g)?.length, 5);
  assert.equal(landing.match(/type="image\/webp"/g)?.length, 5);
  assert.equal(landing.match(/<img\b(?=[^>]*\bsrc="[^"]+\.png")/g)?.length, 5);
  assert.match(landing, /<img\b(?=[^>]*\bwidth="2077")(?=[^>]*\bheight="1208")[^>]*>/);
  assert.equal(
    landing.match(/<img\b(?=[^>]*\bwidth="1792")(?=[^>]*\bheight="1344")[^>]*>/g)
      ?.length,
    4,
  );

  const landingFooter = landing.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  assert.ok(landingFooter);
  assert.match(landingFooter, /OTTY/);
  assert.match(landingFooter, /href="\/docs\/"[^>]*>Documentation/);
  assert.match(landingFooter, /href="https:\/\/github\.com\/otty-shell\/otty"[^>]*>GitHub/);
  assert.match(
    landingFooter,
    /href="https:\/\/github\.com\/otty-shell\/otty\/blob\/main\/LICENSE"[^>]*>License/,
  );
  assert.match(landingFooter, /© OTTY contributors/);
  assert.doesNotMatch(landingFooter, /Download/);

  assert.match(landing, /href="\/"[^>]*>[\s\S]*?OTTY/);
  assert.match(landing, /href="\/docs\/"/);
  assert.match(landing, /href="\/docs\/install\/"/);
  assert.match(landing, /href="https:\/\/otty\.run\/"[^>]*rel="canonical"/);
  assert.match(landing, /<body[^>]*data-pagefind-ignore/);

  assert.match(documentation, /<h1[^>]*>Documentation<\/h1>/);
  assert.match(documentation, /Glimmerquartz synchronization/);
  assert.match(documentation, /id="glimmerquartz-synchronization"/);
  assert.match(documentation, /data-pagefind-body/);
  assert.match(documentation, /href="\/"/);
  assert.match(documentation, /href="\/docs\/install\/"/);
  assert.match(documentation, /https:\/\/otty\.run\/docs\//);
  assert.match(documentation, /Skip to content/i);
  assert.match(documentation, /<header\b/i);
  assert.match(documentation, /<main\b/i);
  assert.match(documentation, /<nav\b/i);
  assert.match(documentation, /Search/i);

  const priorityPosition = documentation.indexOf('href="/docs/03-priority/"');
  const basicsPosition = documentation.indexOf('href="/docs/01-basics/"');
  const referencePosition = documentation.indexOf('href="/docs/02-reference/"');
  assert.ok(priorityPosition >= 0 && priorityPosition < basicsPosition);
  assert.ok(basicsPosition >= 0 && basicsPosition < referencePosition);
  assert.match(documentation, /href="\/docs\/03-priority\/"[^>]*>[\s\S]*?Priority Guide/);
  assert.match(documentation, /href="\/docs\/01-basics\/"[^>]*>[\s\S]*?Alphabetical Basics/);

  assert.match(installation, /<h1[^>]*>Installation and Downloads<\/h1>/);
  assert.match(installation, /href="\/"/);
  assert.match(installation, /href="\/docs\/"/);
  assert.match(installation, /https:\/\/otty\.run\/docs\/install\//);
  assert.match(installation, /Latest stable/);
  assert.match(installation, /v0\.2\.0/);
  assert.match(installation, /August 29, 2026/);
  assert.match(
    installation,
    /href="https:\/\/github\.com\/otty-shell\/otty\/releases\/tag\/v0\.2\.0"[^>]*>Release notes</,
  );
  assert.equal(
    installation.match(
      /href="https:\/\/github\.com\/otty-shell\/otty\/releases"[^>]*>All releases</g,
    )?.length,
    1,
  );

  const expectedDownloads = [
    ["Debian or Ubuntu-style Linux", "x86-64", "deb", "otty_0.2.0_amd64.deb", "10.8 MB"],
    ["RPM-based Linux", "x86-64", "rpm", "otty-0.2.0-1.x86_64.rpm", "11.3 MB"],
    [
      "macOS",
      "Apple Silicon",
      "dmg",
      "otty_0.2.0-aarch64-apple-darwin.dmg",
      "14.5 MB",
    ],
    ["macOS", "Intel", "dmg", "otty_0.2.0-x86_64-apple-darwin.dmg", "15.1 MB"],
  ];

  for (const [platform, architecture, format, filename, roundedSize] of expectedDownloads) {
    assert.match(installation, new RegExp(platform));
    assert.match(installation, new RegExp(architecture));
    assert.match(installation, new RegExp(`>${format}<`, "i"));
    assert.match(installation, new RegExp(filename.replaceAll(".", "\\.")));
    assert.match(installation, new RegExp(roundedSize.replace(".", "\\.")));
    assert.match(
      installation,
      new RegExp(
        `href="https://github\\.com/otty-shell/otty/releases/download/v0\\.2\\.0/${filename.replaceAll(".", "\\.")}"`,
      ),
    );
  }

  assert.match(installation, /Apple Silicon[^<]*M1 or newer/i);
  assert.match(installation, /Intel-based Macs/i);
  assert.match(installation, /Linux x86-64[^<]*Intel or AMD 64-bit/i);
  assert.match(installation, /Windows is currently unavailable/i);
  assert.match(installation, /Linux ARM64[^<]*currently unavailable/i);
  assert.match(installation, /not notarized by Apple/i);
  assert.match(installation, /System Settings/i);
  assert.match(installation, /Privacy (?:&amp;|&#x26;|&)\s*Security/i);
  assert.match(installation, /Open Anyway/i);
  assert.doesNotMatch(installation, /api\.github\.com|Coming soon|disable Gatekeeper|xattr/i);

  assert.match(nestedGuide, /<h1[^>]*>Nested Operations<\/h1>/);
  assert.match(nestedGuide, /<img[^>]*alt="Terminal map"/);
  assert.equal(nestedGuide.match(/alt="Terminal map"/g)?.length, 1);
  const relativeAssetPath = nestedGuide.match(
    /<img\b(?=[^>]*\balt="Terminal map")(?=[^>]*\bsrc="([^"]+)")[^>]*>/,
  )?.[1];
  assert.ok(relativeAssetPath);
  assert.equal(existsSync(join(artifactPath, relativeAssetPath.replace(/^\//, ""))), true);
  assert.match(
    readArtifact("docs/05-components/index.html"),
    /Approved Starlight MDX remains available/,
  );

  for (const asset of ["logo-full.svg", "logo-small.svg", "otty.png"]) {
    assert.equal(existsSync(join(artifactPath, "assets", asset)), true);
  }
  for (const font of ["hack-regular.woff2", "hack-bold.woff2"]) {
    assert.equal(existsSync(join(artifactPath, "fonts", "hack", font)), true);
  }

  const completeArtifact = listFiles(artifactPath)
    .filter((path) => path.endsWith(".html"))
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");
  assert.equal(completeArtifact.match(/alt="Terminal map"/g)?.length, 1);
  assert.doesNotMatch(completeArtifact, /artifact-internal-marker/);

  assert.equal(readArtifact("CNAME"), "otty.run\n");
  assert.equal(existsSync(join(artifactPath, "server")), false);
  assert.equal(existsSync(join(artifactPath, "pagefind", "pagefind.js")), true);

  const documentationSearch = await searchProductionIndex("glimmerquartz");
  assert.ok(documentationSearch.results.length > 0);
  assert.ok(
    documentationSearch.results.some(
      (result) =>
        result.raw_url === "/docs/" &&
        result.sub_results.some((subResult) =>
          subResult.url.endsWith("/docs/#glimmerquartz-synchronization"),
        ),
    ),
  );

  const productLandingSearch = await searchProductionIndex("workspace");
  assert.equal(productLandingSearch.results.length, 0);
});

test("a live-input build prerenders validated release facts without a runtime API call", async () => {
  rmSync(artifactPath, { recursive: true, force: true });
  const ottySource = createPublicDocumentationSource();
  const stableRelease = readStableReleaseFixture(repositoryRoot);

  try {
    await withReleaseApi(
      { body: JSON.stringify(stableRelease) },
      async ({ apiUrl, requests }) => {
        const buildEnvironment = createBuildEnvironment(ottySource, {
          OTTY_RELEASE_SOURCE: "github",
          OTTY_GITHUB_RELEASES_API_URL: apiUrl,
        });
        const build = await runNpmScriptAsync(repositoryRoot, "build", buildEnvironment);

        assert.equal(
          build.status,
          0,
          `production build failed\n\nstdout:\n${build.stdout}\n\nstderr:\n${build.stderr}`,
        );
        assert.equal(requests.length, 1);

        const installation = htmlBeforeClientJavaScript("docs/install/index.html");
        assert.match(installation, /Latest stable/);
        assert.match(installation, /v0\.2\.0/);
        assert.match(installation, /August 29, 2026/);
        assert.match(
          installation,
          /href="https:\/\/github\.com\/otty-shell\/otty\/releases\/tag\/v0\.2\.0"/,
        );
        assert.equal(
          installation.match(
            /href="https:\/\/github\.com\/otty-shell\/otty\/releases\/download\/v0\.2\.0\//g,
          )?.length,
          4,
        );
        assert.doesNotMatch(
          listFiles(artifactPath)
            .filter((path) => path.endsWith(".html") || path.endsWith(".js"))
            .map((path) => readFileSync(path, "utf8"))
            .join("\n"),
          /api\.github\.com|127\.0\.0\.1/,
        );
      },
    );
  } finally {
    rmSync(ottySource, { recursive: true, force: true });
  }
});

test("live-input failures stop the production build before an artifact exists", async () => {
  const ottySource = createPublicDocumentationSource();
  const invalidMatrix = structuredClone(readStableReleaseFixture(repositoryRoot));
  invalidMatrix.assets[1].name = "otty-0.2.0.x86_64.rpm";
  const failures = [
    {
      name: "API failure",
      response: { status: 503, body: JSON.stringify({ message: "unavailable" }) },
      message: /GitHub Releases API request failed.*503/i,
    },
    {
      name: "invalid package matrix",
      response: { body: JSON.stringify(invalidMatrix) },
      message: /exactly one required asset.*rpm/i,
    },
  ];

  try {
    for (const failure of failures) {
      rmSync(artifactPath, { recursive: true, force: true });

      await withReleaseApi(failure.response, async ({ apiUrl }) => {
        const buildEnvironment = createBuildEnvironment(ottySource, {
          OTTY_RELEASE_SOURCE: "github",
          OTTY_GITHUB_RELEASES_API_URL: apiUrl,
        });
        const build = await runNpmScriptAsync(repositoryRoot, "build", buildEnvironment);

        assert.notEqual(build.status, 0, failure.name);
        assert.match(`${build.stdout}\n${build.stderr}`, failure.message, failure.name);
        assert.equal(existsSync(artifactPath), false, failure.name);
      });
    }

    rmSync(artifactPath, { recursive: true, force: true });
    rmSync(generatedReleaseDataPath, { recursive: true, force: true });
    mkdirSync(generatedReleaseDataPath, { recursive: true });
    const generatedDataFailureEnvironment = createBuildEnvironment(ottySource, {
      OTTY_RELEASE_SOURCE: "github",
    });
    const generatedDataFailure = await runNpmScriptAsync(
      repositoryRoot,
      "build",
      generatedDataFailureEnvironment,
    );

    assert.notEqual(generatedDataFailure.status, 0);
    assert.match(
      `${generatedDataFailure.stdout}\n${generatedDataFailure.stderr}`,
      /EISDIR|is a directory/i,
    );
    assert.equal(existsSync(artifactPath), false);
  } finally {
    rmSync(generatedReleaseDataPath, { recursive: true, force: true });
    rmSync(releaseDataStageManifestPath, { force: true });
    rmSync(ottySource, { recursive: true, force: true });
  }
});
