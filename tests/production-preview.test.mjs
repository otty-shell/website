import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { writeTestFile } from "./helpers/filesystem.mjs";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const temporaryRoots = [];

function createPublicDocumentationSource() {
  const sourceRoot = mkdtempSync(join(tmpdir(), "otty-production-preview-"));
  const documentationRoot = join(sourceRoot, "relocated", "public-manual");
  const documentationIndex = join(documentationRoot, "index.md");
  temporaryRoots.push(sourceRoot);

  writeTestFile(
    documentationIndex,
    "---\ntitle: Documentation\n---\n\nProduction preview guidance.\n",
  );
  writeTestFile(
    join(documentationRoot, "Getting Started", "Installation", "Binary.mdx"),
    "---\ntitle: Binary\n---\n\n<LatestDownloads />\n",
  );

  return documentationIndex;
}

function createEnvironment(documentationIndex, releaseSource) {
  const environment = {
    ...process.env,
    OTTY_DOCUMENTATION_INDEX: documentationIndex,
  };
  delete environment.CI;
  delete environment.GITHUB_ACTIONS;
  delete environment.PAGEFIND_BINARY_PATH;
  delete environment.PAGEFIND_EXTENDED_BINARY_PATH;

  if (releaseSource === undefined) {
    delete environment.OTTY_RELEASE_SOURCE;
  } else {
    environment.OTTY_RELEASE_SOURCE = releaseSource;
  }

  return environment;
}

function runProductionPreview(environment, arguments_ = []) {
  return spawnSync(npm, ["run", "preview:production", "--", ...arguments_], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: environment,
  });
}

function stopProductionPreview() {
  return spawnSync(npm, ["run", "preview", "--", "stop"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
}

async function availablePort() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  return address.port;
}

test.after(() => {
  for (const directory of temporaryRoots) {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("production preview requires an explicit Documentation index", () => {
  const environment = { ...process.env, OTTY_RELEASE_SOURCE: "fixture" };
  delete environment.OTTY_DOCUMENTATION_INDEX;
  delete environment.CI;
  delete environment.GITHUB_ACTIONS;

  const preview = runProductionPreview(environment);

  assert.notEqual(preview.status, 0);
  assert.match(`${preview.stdout}\n${preview.stderr}`, /OTTY_DOCUMENTATION_INDEX.*required/is);
});

test("production preview rejects an unsupported release input selection", () => {
  const preview = runProductionPreview(
    createEnvironment(createPublicDocumentationSource(), "live"),
  );

  assert.notEqual(preview.status, 0);
  assert.match(`${preview.stdout}\n${preview.stderr}`, /OTTY_RELEASE_SOURCE.*fixture.*github/is);
});

test("production preview stops when Astro cannot render the staged Documentation", () => {
  const documentationIndex = createPublicDocumentationSource();
  writeTestFile(
    join(dirname(documentationIndex), "broken.mdx"),
    "---\ntitle: Broken article\n---\n\n{missingProductionPreviewValue}\n",
  );

  const preview = runProductionPreview(
    createEnvironment(documentationIndex, "fixture"),
  );

  assert.notEqual(preview.status, 0);
  assert.match(
    `${preview.stdout}\n${preview.stderr}`,
    /missingProductionPreviewValue is not defined/i,
  );
});

test("production preview stops when Pagefind cannot build the search index", () => {
  const environment = createEnvironment(createPublicDocumentationSource(), "fixture");
  environment.PAGEFIND_EXTENDED_BINARY_PATH = join(
    tmpdir(),
    "missing-otty-production-preview-pagefind",
  );

  const preview = runProductionPreview(environment);

  assert.notEqual(preview.status, 0);
  assert.match(
    `${preview.stdout}\n${preview.stderr}`,
    /Failed to run Pagefind|Pagefind backend closed/i,
  );
});

test("production preview serves the completed static artifact and prints its local URL", async () => {
  const port = await availablePort();
  const localUrl = `http://127.0.0.1:${port}/`;
  const preview = runProductionPreview(
    createEnvironment(createPublicDocumentationSource(), "fixture"),
    ["--background", "--host", "127.0.0.1", "--port", `${port}`],
  );

  try {
    assert.equal(
      preview.status,
      0,
      `production preview failed\n\nstdout:\n${preview.stdout}\n\nstderr:\n${preview.stderr}`,
    );
    assert.match(
      `${preview.stdout}\n${preview.stderr}`,
      new RegExp(localUrl.slice(0, -1).replaceAll(".", "\\.")),
    );

    const response = await fetch(localUrl);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), readFileSync(join(repositoryRoot, "dist", "index.html"), "utf8"));
  } finally {
    if (preview.status === 0) stopProductionPreview();
  }
});
