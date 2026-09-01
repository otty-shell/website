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
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { JSDOM } from "jsdom";
import { assertCapabilitySequenceBehavior } from "./helpers/capability-sequence.mjs";
import { writeTestFile } from "./helpers/filesystem.mjs";
import { runNpmScriptAsync } from "./helpers/process.mjs";
import { withReleaseApi } from "./helpers/release-api.mjs";
import { readStableReleaseFixture } from "./helpers/release-fixture.mjs";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const artifactPath = join(repositoryRoot, "dist");
const generatedPath = join(repositoryRoot, ".generated");
const generatedReleaseDataPath = join(generatedPath, "release-data.json");
const releaseDataStageManifestPath = join(generatedPath, "release-data-stage.json");
const canonicalOrigin = "https://otty.run";
const expectedTitleByCanonicalRoute = new Map([
  ["/", "OTTY — Terminal-first Workspace"],
  ["/docs/", "Documentation | OTTY Documentation"],
  ["/docs/01-basics/", "Alphabetical Basics | OTTY Documentation"],
  ["/docs/02-reference/", "Alphabetical Reference | OTTY Documentation"],
  ["/docs/03-priority/", "Priority Guide | OTTY Documentation"],
  ["/docs/04-guides/", "Nested Operations | OTTY Documentation"],
  ["/docs/05-components/", "Component Guidance | OTTY Documentation"],
  [
    "/docs/getting-started/installation/binary/",
    "Binary | OTTY Documentation",
  ],
]);

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

function artifactPathForRoute(route) {
  return route === "/" ? "index.html" : `${route.slice(1)}index.html`;
}

function parseArtifactHtml(route) {
  return new JSDOM(readArtifact(artifactPathForRoute(route)), {
    url: new URL(route, canonicalOrigin),
  }).window.document;
}

function parseArtifactXml(relativePath) {
  return new JSDOM(readArtifact(relativePath), {
    contentType: "application/xml",
  }).window.document;
}

function assertCrawlablePublicArtifact() {
  const titles = new Set();
  const linkedRoutes = new Set();
  const documentByCanonicalRoute = new Map(
    [...expectedTitleByCanonicalRoute.keys()].map((route) => [route, parseArtifactHtml(route)]),
  );

  for (const [route, expectedTitle] of expectedTitleByCanonicalRoute) {
    const document = documentByCanonicalRoute.get(route);
    const canonicalUrl = new URL(route, canonicalOrigin).href;
    const title = document.querySelector("title")?.textContent;
    const canonicalLinks = document.querySelectorAll('link[rel="canonical"]');
    const visibleContent = document.querySelector("main")?.textContent.replaceAll(/\s+/g, " ").trim();
    const noindexDirectives = [...document.head.querySelectorAll("meta")].filter((meta) =>
      /\bnoindex\b/i.test(meta.getAttribute("content") ?? ""),
    );

    assert.ok(visibleContent && visibleContent.length >= 20, `${route} has substantive HTML`);
    assert.equal(title, expectedTitle, `${route} has its authored title`);
    assert.equal(canonicalLinks.length, 1, `${route} has one canonical link`);
    assert.equal(canonicalLinks[0].getAttribute("href"), canonicalUrl);
    assert.equal(noindexDirectives.length, 0, `${route} has no noindex directive`);
    titles.add(title);

    const internalLinks = [...document.querySelectorAll("a[href]")].filter((anchor) => {
      const url = new URL(anchor.getAttribute("href"), canonicalUrl);
      return url.origin === canonicalOrigin;
    });
    assert.ok(internalLinks.length > 0, `${route} has ordinary internal links`);

    for (const anchor of internalLinks) {
      const url = new URL(anchor.getAttribute("href"), canonicalUrl);
      assert.equal(expectedTitleByCanonicalRoute.has(url.pathname), true, `${url.href} resolves`);
      assert.doesNotMatch(anchor.getAttribute("rel") ?? "", /\bnofollow\b/i);
      if (url.hash) {
        const targetDocument = documentByCanonicalRoute.get(url.pathname);
        assert.ok(
          targetDocument.getElementById(decodeURIComponent(url.hash.slice(1))),
          `${url.href} resolves`,
        );
      }
      linkedRoutes.add(url.pathname);
    }
  }

  assert.equal(titles.size, expectedTitleByCanonicalRoute.size);
  assert.deepEqual([...linkedRoutes].sort(), [...expectedTitleByCanonicalRoute.keys()].sort());

  const productLanding = documentByCanonicalRoute.get("/");
  assert.equal(
    productLanding.querySelector('meta[name="description"]')?.getAttribute("content"),
    "OTTY is an Early Release Terminal-first Workspace for development and operations across local and remote machines.",
  );

  assert.equal(
    readArtifact("robots.txt"),
    "User-agent: *\nAllow: /\n\nSitemap: https://otty.run/sitemap-index.xml\n",
  );

  const sitemapIndex = parseArtifactXml("sitemap-index.xml");
  const sitemapLocations = [...sitemapIndex.querySelectorAll("sitemap > loc")].map(
    (location) => location.textContent,
  );
  assert.deepEqual(sitemapLocations, ["https://otty.run/sitemap-0.xml"]);

  const rootSitemap = parseArtifactXml(new URL(sitemapLocations[0]).pathname.slice(1));
  const sitemapRoutes = [...rootSitemap.querySelectorAll("url > loc")]
    .map((location) => location.textContent)
    .sort();
  const expectedCanonicalUrls = [...expectedTitleByCanonicalRoute.keys()]
    .map((route) => new URL(route, canonicalOrigin).href)
    .sort();
  assert.deepEqual(sitemapRoutes, expectedCanonicalUrls);
}

function createPublicDocumentationSource() {
  const sourceRoot = mkdtempSync(join(tmpdir(), "otty-website-artifact-"));
  const publicSource = join(sourceRoot, "relocated", "public-manual");
  const documentationIndex = join(publicSource, "index.md");

  writeTestFile(
    documentationIndex,
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
    join(publicSource, "Getting Started", "Installation", "Binary.mdx"),
    `---
title: Binary
---

Choose the package that matches your computer.

<LatestDownloads />

[Return to Documentation](/docs/) or the [OTTY Product Landing](/).
`,
  );
  writeTestFile(
    join(sourceRoot, "unrelated", "internal", "secrets.md"),
    "artifact-internal-marker\n",
  );

  return { sourceRoot, documentationIndex };
}

function createBuildEnvironment(documentationIndex, releaseEnvironment) {
  const environment = {
    ...process.env,
    OTTY_DOCUMENTATION_INDEX: documentationIndex,
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

test("the production artifact contains the Product Landing and synchronized Documentation-only search", async () => {
  rmSync(artifactPath, { recursive: true, force: true });
  const documentationSource = createPublicDocumentationSource();

  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const localBuildEnvironment = createBuildEnvironment(
    documentationSource.documentationIndex,
    { OTTY_RELEASE_SOURCE: "fixture" },
  );
  const build = spawnSync(npm, ["run", "build"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: localBuildEnvironment,
  });

  rmSync(documentationSource.sourceRoot, { recursive: true, force: true });

  assert.equal(
    build.status,
    0,
    `production build failed\n\nstdout:\n${build.stdout}\n\nstderr:\n${build.stderr}`,
  );

  const landing = htmlBeforeClientJavaScript("index.html");
  const documentation = htmlBeforeClientJavaScript("docs/index.html");
  const installation = htmlBeforeClientJavaScript(
    "docs/getting-started/installation/binary/index.html",
  );
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
  assert.match(landingHeader, /href="\/"[^>]*aria-label="OTTY Product Landing"/);
  assert.match(landingHeader, /src="\/assets\/logo\.svg"/);
  assert.doesNotMatch(landingHeader, /<span>\s*OTTY\s*<\/span>/);
  assert.doesNotMatch(landingHeader, /href="\/docs\/"[^>]*>Documentation/);
  assert.match(
    landingHeader,
    /href="https:\/\/github\.com\/otty-shell\/otty"[^>]*aria-label="OTTY on GitHub, 0 stars"[^>]*data-github-link/,
  );
  assert.match(landingHeader, /data-github-stars-count[^>]*>0<\/span>/);
  assert.equal(landingHeader.match(/<svg\b/g)?.length, 2);
  assert.match(
    landingHeader,
    /href="\/docs\/getting-started\/installation\/binary\/"[^>]*>GET STARTED/,
  );

  const landingMain = landing.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(landingMain);
  assert.match(landingMain, /Early Release/);
  assert.match(landingMain, /Linux/);
  assert.match(landingMain, /macOS/);
  assert.match(
    landingMain,
    /href="\/docs\/getting-started\/installation\/binary\/"[^>]*>[\s\S]*?download_otty/,
  );
  assert.match(landingMain, /href="\/docs\/"[^>]*>[\s\S]*?read_docs/);
  assert.match(landingMain, /<h2[^>]*>current_capabilities<\/h2>/);
  assert.doesNotMatch(landingMain, /otty capabilities\.list|4 entries \/ latest Published Release/);

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

  const capabilitySequence = landingMain.match(
    /<section\b[^>]*aria-labelledby="capabilities-title"[\s\S]*?<\/section>/,
  )?.[0];
  assert.ok(capabilitySequence);
  assert.match(
    capabilitySequence,
    /role="tablist"[^>]*aria-label="Current Capabilities"/,
  );
  assert.equal(capabilitySequence.match(/role="tab"/g)?.length, 4);
  for (const tabName of ["Workspace", "Command blocks", "Explorer", "Quick Launch"]) {
    assert.match(capabilitySequence, new RegExp(`role="tab"[^>]*>[\\s\\S]*?${tabName}`));
  }
  assert.doesNotMatch(capabilitySequence, />\s*(?:Previous|Next)\s*</i);

  const capabilityPanels = capabilitySequence.match(/<article\b[^>]*role="tabpanel"[^>]*>/g);
  assert.equal(capabilityPanels?.length, 4);
  for (const panel of capabilityPanels ?? []) {
    assert.doesNotMatch(panel, /\bhidden\b/);
  }

  assert.equal(capabilitySequence.match(/<video\b/g)?.length, 4);
  assert.equal(capabilitySequence.match(/<source\b(?=[^>]*type="video\/webm")/g)?.length, 4);
  assert.equal(capabilitySequence.match(/<video\b(?=[^>]*\bmuted)(?=[^>]*\bloop)(?=[^>]*\bplaysinline)[^>]*>/g)?.length, 4);
  assert.equal(capabilitySequence.match(/<video\b(?=[^>]*\bposter="[^"]+\.png")/g)?.length, 4);
  assert.equal(capabilitySequence.match(/<video\b[^>]*\bautoplay\b/g)?.length ?? 0, 0);
  for (const description of [
    "A terminal tab is opened, the workspace is divided into multiple panes, and separate Claude Code and htop sessions are started for parallel work.",
    "A Cargo configuration file is printed, the resulting command block menu is opened, and a command is copied and reused at the prompt.",
    "The terminal is split into multiple panes, Explorer is opened, and one session changes directory so the file tree follows its project context.",
    "A saved SSH connection is created in Quick Launch and then opened as an interactive remote Ubuntu shell session.",
  ]) {
    assert.match(capabilitySequence, new RegExp(description.replaceAll(".", "\\.")));
  }

  assertCapabilitySequenceBehavior(readArtifact("index.html"));

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
  assert.equal(landingMain.match(/<img\b(?=[^>]*\bsrc="[^"]+\.png")/g)?.length, 5);
  for (const image of [
    "hero.png",
    "workspace-poster.png",
    "command-blocks-poster.png",
    "explorer-poster.png",
    "quick-launch-poster.png",
  ]) {
    assert.match(landing, new RegExp(`src="/assets/product-evidence/${image.replaceAll(".", "\\.")}"`));
  }
  assert.match(landing, /<img\b(?=[^>]*\bwidth="2077")(?=[^>]*\bheight="1208")[^>]*>/);
  assert.equal(
    landing.match(/<img\b(?=[^>]*\bwidth="1792")(?=[^>]*\bheight="1344")[^>]*>/g)
      ?.length,
    4,
  );

  const landingFooter = landing.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  assert.ok(landingFooter);
  assert.match(landingFooter, /OTTY/);
  assert.match(landingFooter, /src="\/assets\/logo\.svg"/);
  assert.doesNotMatch(landingFooter, /<span>\s*OTTY\s*<\/span>/);
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
  assert.match(landing, /href="\/docs\/getting-started\/installation\/binary\/"/);
  assert.match(landing, /href="https:\/\/otty\.run\/"[^>]*rel="canonical"/);
  assert.match(landing, /<body[^>]*data-pagefind-ignore/);

  assert.match(documentation, /<h1[^>]*>Documentation<\/h1>/);
  assert.match(documentation, /Glimmerquartz synchronization/);
  assert.match(documentation, /id="glimmerquartz-synchronization"/);
  assert.match(documentation, /data-pagefind-body/);
  assert.match(documentation, /href="\/"/);
  assert.match(documentation, /href="\/docs\/getting-started\/installation\/binary\/"/);
  assert.match(documentation, /https:\/\/otty\.run\/docs\//);
  assert.match(documentation, /Skip to content/i);
  assert.match(documentation, /<header\b/i);
  assert.match(documentation, /<main\b/i);
  assert.match(documentation, /<nav\b/i);
  assert.match(documentation, /Search/i);

  const documentationPage = parseArtifactHtml("/docs/");
  const documentationHeader = documentationPage.querySelector("header");
  assert.ok(documentationHeader);
  assert.equal(documentationPage.documentElement.dataset.theme, "dark");
  assert.equal(
    documentationPage.querySelector('meta[name="color-scheme"]')?.getAttribute("content"),
    "dark",
  );
  assert.equal(documentationPage.querySelector("starlight-theme-select"), null);
  assert.equal(
    documentationHeader.querySelector('a[href="/"]')?.getAttribute("aria-label"),
    "OTTY Product Landing",
  );
  assert.equal(documentationHeader.querySelector('a[href="/"] span'), null);
  assert.equal(
    documentationHeader.querySelector('a[href="/"] img')?.getAttribute("src"),
    "/assets/logo.svg",
  );

  const documentationSidebar = documentationPage.querySelector(
    "#starlight__sidebar ul.top-level",
  );
  assert.ok(documentationSidebar);
  assert.ok(
    [...documentationSidebar.children].some((item) =>
      item.querySelector(':scope > a[href="/docs/"]'),
    ),
    "the Documentation index is a root sidebar item",
  );
  assert.equal(
    [...documentationSidebar.children].some(
      (item) => item.querySelector(":scope > details > summary")?.textContent.trim() === "Docs",
    ),
    false,
    "the staged docs directory does not add a redundant Docs sidebar group",
  );

  const priorityPosition = documentation.indexOf('href="/docs/03-priority/"');
  const basicsPosition = documentation.indexOf('href="/docs/01-basics/"');
  const referencePosition = documentation.indexOf('href="/docs/02-reference/"');
  assert.ok(priorityPosition >= 0 && priorityPosition < basicsPosition);
  assert.ok(basicsPosition >= 0 && basicsPosition < referencePosition);
  assert.match(documentation, /href="\/docs\/03-priority\/"[^>]*>[\s\S]*?Priority Guide/);
  assert.match(documentation, /href="\/docs\/01-basics\/"[^>]*>[\s\S]*?Alphabetical Basics/);

  assert.match(installation, /<h1[^>]*>Binary<\/h1>/);
  assert.match(installation, /href="\/"/);
  assert.match(installation, /href="\/docs\/"/);
  assert.match(
    installation,
    /https:\/\/otty\.run\/docs\/getting-started\/installation\/binary\//,
  );
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

  const installationPage = parseArtifactHtml(
    "/docs/getting-started/installation/binary/",
  );
  const platformSections = [
    ...installationPage.querySelectorAll(".platform-sections > .platform-section"),
  ];
  assert.deepEqual(
    platformSections.map((section) => section.querySelector("h2")?.textContent.trim()),
    ["Linux", "macOS", "Windows"],
  );
  assert.deepEqual(
    platformSections.map((section) => section.querySelector("h2")?.id),
    ["linux", "macos", "windows"],
  );
  assert.equal(installationPage.querySelector(".platform-index"), null);
  for (const slug of ["linux", "macos", "windows"]) {
    assert.ok(
      installationPage.querySelector(`.platform-section a.section-anchor[href="#${slug}"]`),
      `${slug} exposes a section permalink`,
    );
    assert.equal(
      installationPage.querySelectorAll(`starlight-toc a[href="#${slug}"]`).length,
      1,
      `${slug} appears once in the desktop table of contents`,
    );
    assert.equal(
      installationPage.querySelectorAll(`mobile-starlight-toc a[href="#${slug}"]`).length,
      1,
      `${slug} appears once in the mobile table of contents`,
    );
    assert.equal(
      documentationPage.querySelector(`starlight-toc a[href="#${slug}"]`),
      null,
      `${slug} does not leak into another page's table of contents`,
    );
  }
  assert.equal(installationPage.querySelector(".latest-downloads table"), null);
  assert.equal(
    installationPage.querySelectorAll(".platform-section a[download]").length,
    4,
  );
  const windowsSection = platformSections.find(
    (section) => section.querySelector("h2")?.textContent.trim() === "Windows",
  );
  assert.ok(windowsSection);
  assert.match(windowsSection.textContent, /Windows[\s\S]*Coming soon/i);
  assert.equal(windowsSection.querySelector("a[download], button"), null);

  const expectedDownloads = [
    ["Linux", ".deb", "x64", "otty_0.2.0-amd64.deb"],
    ["Linux", ".rpm", "x64", "otty_0.2.0-x86_64.rpm"],
    ["macOS", ".dmg", "ARM64", "otty_0.2.0-aarch64-apple-darwin.dmg"],
    ["macOS", ".dmg", "Intel", "otty_0.2.0-x86_64-apple-darwin.dmg"],
  ];

  for (const [platform, format, architecture, filename] of expectedDownloads) {
    const section = platformSections.find((candidate) =>
      candidate.querySelector("h2")?.textContent.trim() === platform,
    );
    assert.ok(section, `${platform} section is rendered`);
    const formatRow = [...section.querySelectorAll(".format-row")].find(
      (row) => row.querySelector("h4")?.textContent.trim() === format,
    );
    assert.ok(formatRow, `${platform} exposes ${format}`);
    const action = [...formatRow.querySelectorAll("a[download]")].find(
      (anchor) => anchor.textContent.trim() === architecture,
    );
    assert.ok(action, `${platform} ${format} exposes ${architecture}`);
    assert.equal(
      action.getAttribute("href"),
      `https://github.com/otty-shell/otty/releases/download/v0.2.0/${filename}`,
    );
    assert.equal(action.getAttribute("download"), filename);
  }
  const linuxSection = platformSections.find(
    (section) => section.querySelector("h2")?.textContent.trim() === "Linux",
  );
  const macosSection = platformSections.find(
    (section) => section.querySelector("h2")?.textContent.trim() === "macOS",
  );
  assert.ok(linuxSection);
  assert.ok(macosSection);
  assert.ok(linuxSection.querySelector(".format-list + .platform-note"));
  assert.ok(macosSection.querySelector(".format-list + .platform-note"));
  assert.match(linuxSection.querySelector(".platform-note").textContent, /Intel or AMD 64-bit/i);
  assert.match(linuxSection.querySelector(".platform-note").textContent, /Linux ARM64/i);
  assert.match(macosSection.querySelector(".platform-note").textContent, /M1 or newer/i);
  assert.match(macosSection.querySelector(".platform-note").textContent, /Intel-based Macs/i);
  assert.match(macosSection.querySelector(".platform-note").textContent, /not notarized by Apple/i);
  assert.match(macosSection.querySelector(".platform-note").textContent, /Open Anyway/i);
  assert.doesNotMatch(
    installationPage.querySelector(".platform-sections").textContent,
    /\bMB\b|Debian|RPM-based|otty[_-]0\.2\.0/i,
  );

  assert.match(installation, /Apple Silicon[^<]*M1 or newer/i);
  assert.match(installation, /Intel-based Macs/i);
  assert.match(installation, /Coming soon/i);
  assert.match(installation, /not notarized by Apple/i);
  assert.match(installation, /System Settings/i);
  assert.match(installation, /Privacy (?:&amp;|&#x26;|&)\s*Security/i);
  assert.match(installation, /Open Anyway/i);
  assert.doesNotMatch(installation, /api\.github\.com|disable Gatekeeper|xattr/i);

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

  assert.equal(existsSync(join(artifactPath, "assets", "logo.svg")), true);
  for (const asset of [
    "hero.png",
    "workspace-poster.png",
    "workspace.webm",
    "command-blocks-poster.png",
    "command-blocks.webm",
    "explorer-poster.png",
    "explorer.webm",
    "quick-launch-poster.png",
    "quick-launch.webm",
  ]) {
    assert.equal(existsSync(join(artifactPath, "assets", "product-evidence", asset)), true);
  }
  for (const font of [
    "jetbrains-mono-regular.woff2",
    "jetbrains-mono-bold.woff2",
    "OFL.txt",
  ]) {
    assert.equal(existsSync(join(artifactPath, "fonts", "jetbrains-mono", font)), true);
  }

  const completeArtifact = listFiles(artifactPath)
    .filter((path) => path.endsWith(".html"))
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");
  const completeStyles = [
    completeArtifact,
    ...listFiles(artifactPath)
      .filter((path) => path.endsWith(".css"))
      .map((path) => readFileSync(path, "utf8")),
  ].join("\n");
  const artifactFiles = listFiles(artifactPath).map((path) => relative(artifactPath, path));
  const repositoryOnlyPaths = [
    ".generated",
    ".git",
    ".github",
    "fixtures",
    "node_modules",
    "scripts",
    "src",
    "tests",
  ];

  for (const repositoryOnlyPath of repositoryOnlyPaths) {
    assert.equal(
      artifactFiles.some(
        (path) => path === repositoryOnlyPath || path.startsWith(`${repositoryOnlyPath}/`),
      ),
      false,
      `${repositoryOnlyPath} remains outside the public artifact`,
    );
  }
  for (const repositorySourceFile of [
    "astro.config.mjs",
    "package-lock.json",
    "package.json",
    "tsconfig.json",
  ]) {
    assert.equal(artifactFiles.includes(repositorySourceFile), false);
  }
  assert.equal(completeArtifact.match(/alt="Terminal map"/g)?.length, 1);
  assert.doesNotMatch(completeArtifact, /artifact-internal-marker/);
  assert.match(completeStyles, /--otty-grid-background:linear-gradient\(/);
  assert.match(completeStyles, /--otty-grid-size:4\.5rem 4\.5rem/);
  assert.match(completeStyles, /body\.landing-page[^}]*background:var\(--otty-grid-background\)/);
  assert.match(
    completeStyles,
    /body:not\(\.landing-page\),body:not\(\.landing-page\) header\.header,body:not\(\.landing-page\) \.sidebar-pane\{background:var\(--otty-grid-background\)/,
  );

  assert.equal(readArtifact("CNAME"), "otty.run\n");
  assert.equal(existsSync(join(artifactPath, "server")), false);
  assert.equal(existsSync(join(artifactPath, "pagefind", "pagefind.js")), true);

  assertCrawlablePublicArtifact();

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

test("a local build defaults to live release facts while stars refresh at runtime", async () => {
  rmSync(artifactPath, { recursive: true, force: true });
  const documentationSource = createPublicDocumentationSource();
  const stableRelease = readStableReleaseFixture(repositoryRoot);

  try {
    await withReleaseApi(
      { body: JSON.stringify(stableRelease) },
      async ({ apiUrl, requests }) => {
        const buildEnvironment = createBuildEnvironment(
          documentationSource.documentationIndex,
          {
            OTTY_GITHUB_RELEASES_API_URL: apiUrl,
          },
        );
        const build = await runNpmScriptAsync(repositoryRoot, "build", buildEnvironment);

        assert.equal(
          build.status,
          0,
          `production build failed\n\nstdout:\n${build.stdout}\n\nstderr:\n${build.stderr}`,
        );
        assert.equal(requests.length, 1);

        const installation = htmlBeforeClientJavaScript(
          "docs/getting-started/installation/binary/index.html",
        );
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
        const browserArtifact = listFiles(artifactPath)
          .filter((path) => path.endsWith(".html") || path.endsWith(".js"))
          .map((path) => readFileSync(path, "utf8"))
          .join("\n");
        assert.match(browserArtifact, /https:\/\/api\.github\.com\/repos\/otty-shell\/otty/);
        assert.doesNotMatch(browserArtifact, /api\.github\.com\/repos\/otty-shell\/otty\/releases|127\.0\.0\.1/);
      },
    );
  } finally {
    rmSync(documentationSource.sourceRoot, { recursive: true, force: true });
  }
});

test("live-input failures stop the production build before an artifact exists", async () => {
  const documentationSource = createPublicDocumentationSource();
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
        const buildEnvironment = createBuildEnvironment(
          documentationSource.documentationIndex,
          {
            OTTY_RELEASE_SOURCE: "github",
            OTTY_GITHUB_RELEASES_API_URL: apiUrl,
          },
        );
        const build = await runNpmScriptAsync(repositoryRoot, "build", buildEnvironment);

        assert.notEqual(build.status, 0, failure.name);
        assert.match(`${build.stdout}\n${build.stderr}`, failure.message, failure.name);
        assert.equal(existsSync(artifactPath), false, failure.name);
      });
    }

    rmSync(artifactPath, { recursive: true, force: true });
    rmSync(generatedReleaseDataPath, { recursive: true, force: true });
    mkdirSync(generatedReleaseDataPath, { recursive: true });
    const generatedDataFailureEnvironment = createBuildEnvironment(
      documentationSource.documentationIndex,
      { OTTY_RELEASE_SOURCE: "github" },
    );
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
    const restoration = await runNpmScriptAsync(
      repositoryRoot,
      "prepare:release",
      createBuildEnvironment(documentationSource.documentationIndex, {
        OTTY_RELEASE_SOURCE: "fixture",
      }),
    );
    rmSync(documentationSource.sourceRoot, { recursive: true, force: true });
    assert.equal(
      restoration.status,
      0,
      `release stage restoration failed\n\nstdout:\n${restoration.stdout}\n\nstderr:\n${restoration.stderr}`,
    );
  }
});

test("production artifact verification leaves a valid release stage for local development", () => {
  assert.equal(existsSync(generatedReleaseDataPath), true);
  assert.equal(existsSync(releaseDataStageManifestPath), true);
});
