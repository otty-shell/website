import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { writeTestFile } from "./helpers/filesystem.mjs";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const artifactPath = join(repositoryRoot, "dist");

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
    join(publicSource, "install.md"),
    `---
title: Installation and Downloads
---

Installation guidance remains at this stable route.

[Return to Documentation](/docs/) or the [OTTY Product Landing](/).
`,
  );
  writeTestFile(
    join(ottySource, "docs", "internal", "secrets.md"),
    "artifact-internal-marker\n",
  );

  return ottySource;
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
  const build = spawnSync(npm, ["run", "build"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: { ...process.env, OTTY_SOURCE_DIR: ottySource },
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
  assert.match(landing, /Terminal-first Workspace/i);
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
