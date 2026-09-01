import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { writeTestFile } from "./helpers/filesystem.mjs";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const stagedDocumentation = join(repositoryRoot, "src", "content", "docs", "docs");
const temporaryRoots = [];

function makeTemporaryDirectory() {
  const directory = mkdtempSync(join(tmpdir(), "otty-website-docs-"));
  temporaryRoots.push(directory);
  return directory;
}

function runPreparation(documentationIndex) {
  return runNpmScript("prepare:docs", documentationIndex);
}

function runNpmScript(script, documentationIndex) {
  const environment = { ...process.env };

  if (documentationIndex === undefined) {
    delete environment.OTTY_DOCUMENTATION_INDEX;
  } else {
    environment.OTTY_DOCUMENTATION_INDEX = documentationIndex;
  }

  return spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", script], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: environment,
  });
}

function listFiles(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name).slice(directory.length + 1))
    .sort();
}

test.after(() => {
  for (const directory of temporaryRoots) {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("documentation preparation requires an explicit absolute Documentation index", () => {
  const missingInput = runPreparation();
  assert.notEqual(missingInput.status, 0);
  assert.match(`${missingInput.stdout}\n${missingInput.stderr}`, /OTTY_DOCUMENTATION_INDEX/);

  const relativeInput = runPreparation("documentation/index.md");
  assert.notEqual(relativeInput.status, 0);
  assert.match(`${relativeInput.stdout}\n${relativeInput.stderr}`, /absolute path.*index\.md/i);

  const sourceRoot = makeTemporaryDirectory();
  const nonIndexInput = runPreparation(resolve(sourceRoot, "relocated", "home.md"));
  assert.notEqual(nonIndexInput.status, 0);
  assert.match(`${nonIndexInput.stdout}\n${nonIndexInput.stderr}`, /file named index\.md/i);

  const missingIndex = resolve(sourceRoot, "relocated", "index.md");
  const missingSource = runPreparation(missingIndex);
  assert.notEqual(missingSource.status, 0);
  assert.match(
    `${missingSource.stdout}\n${missingSource.stderr}`,
    /Documentation index not found.*index\.md/i,
  );
});

test("documentation preparation requires exactly one unconfigured LatestDownloads component on Binary", () => {
  const invalidInstallationPages = [
    {
      name: "missing Binary installation page",
      files: {
        "index.md": "---\ntitle: Documentation\n---\n",
      },
      message: /Getting Started\/Installation\/Binary\.mdx.*required/i,
    },
    {
      name: "missing LatestDownloads component",
      files: {
        "index.md": "---\ntitle: Documentation\n---\n",
        "Getting Started/Installation/Binary.mdx":
          "---\ntitle: Binary\n---\n\nChoose a package.\n",
      },
      message: /exactly one.*LatestDownloads.*found 0/i,
    },
    {
      name: "duplicate LatestDownloads components",
      files: {
        "index.md": "---\ntitle: Documentation\n---\n",
        "Getting Started/Installation/Binary.mdx":
          "---\ntitle: Binary\n---\n\n<LatestDownloads />\n\n<LatestDownloads />\n",
      },
      message: /exactly one.*LatestDownloads.*found 2/i,
    },
    {
      name: "authored release-specific component values",
      files: {
        "index.md": "---\ntitle: Documentation\n---\n",
        "Getting Started/Installation/Binary.mdx":
          '---\ntitle: Binary\n---\n\n<LatestDownloads version="1.2.3" />\n',
      },
      message: /LatestDownloads.*does not accept authored attributes/i,
    },
  ];

  for (const invalidPage of invalidInstallationPages) {
    const documentationRoot = join(
      makeTemporaryDirectory(),
      "relocated",
      "public-manual",
    );

    for (const [relativePath, contents] of Object.entries(invalidPage.files)) {
      writeTestFile(join(documentationRoot, relativePath), contents);
    }

    const preparation = runPreparation(join(documentationRoot, "index.md"));
    assert.notEqual(preparation.status, 0, invalidPage.name);
    assert.match(
      `${preparation.stdout}\n${preparation.stderr}`,
      invalidPage.message,
      invalidPage.name,
    );
  }
});

test("documentation preparation replaces staging with only the public authoring tree", () => {
  const sourceRoot = makeTemporaryDirectory();
  const publicSource = join(sourceRoot, "relocated", "public-manual");

  writeTestFile(
    join(publicSource, "index.md"),
    "---\ntitle: Documentation Home\n---\n\nCurrent rolling guidance.\n",
  );
  writeTestFile(
    join(publicSource, "01-guides", "index.md"),
    "---\ntitle: Guides\n---\n\n![A public diagram](./diagram.svg)\n",
  );
  writeTestFile(
    join(publicSource, "01-guides", "diagram.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg"><title>Public diagram</title></svg>\n',
  );
  writeTestFile(
    join(publicSource, "02-details.mdx"),
    `---
title: Details
---

import { Aside } from '@astrojs/starlight/components';

<Aside>Supported MDX.</Aside>

   ~~~~mdx
   import Widget from 'example-only-package';
   <Widget client:load />
   <script>Example only.</script>
   ~~~~${"   "}
`,
  );
  writeTestFile(
    join(publicSource, "Getting Started", "Installation", "Binary.mdx"),
    "---\ntitle: Binary\n---\n\n<LatestDownloads />\n",
  );
  writeTestFile(
    join(sourceRoot, "unrelated", "internal", "maintainers.md"),
    "internal-only-marker\n",
  );
  writeTestFile(join(sourceRoot, "AGENTS.md"), "agent-only-marker\n");
  writeTestFile(join(stagedDocumentation, "stale.md"), "stale-staging-marker\n");

  const preparation = runPreparation(join(publicSource, "index.md"));

  assert.equal(
    preparation.status,
    0,
    `documentation preparation failed\n\nstdout:\n${preparation.stdout}\n\nstderr:\n${preparation.stderr}`,
  );
  assert.deepEqual(listFiles(stagedDocumentation), [
    "01-guides/diagram.svg",
    "01-guides/index.md",
    "02-details.mdx",
    "Getting Started/Installation/Binary.mdx",
    "index.md",
  ]);
  assert.equal(
    readFileSync(join(stagedDocumentation, "01-guides", "diagram.svg"), "utf8"),
    '<svg xmlns="http://www.w3.org/2000/svg"><title>Public diagram</title></svg>\n',
  );

  const stagedContents = listFiles(stagedDocumentation)
    .map((path) => readFileSync(join(stagedDocumentation, path), "utf8"))
    .join("\n");
  assert.doesNotMatch(stagedContents, /stale-staging-marker|internal-only-marker|agent-only-marker/);
});

test("documentation preparation rejects pages outside the public authoring contract", () => {
  const invalidSources = [
    {
      name: "a page without title frontmatter",
      files: { "index.md": "Documentation without frontmatter.\n" },
      message: /title frontmatter/i,
    },
    {
      name: "an arbitrary MDX package import",
      files: {
        "index.md": "---\ntitle: Documentation\n---\n",
        "extension.mdx":
          "---\ntitle: Extension\n---\n\nimport Widget from 'unapproved-package';\n\n<Widget />\n",
      },
      message: /MDX imports.*@astrojs\/starlight\/components/i,
    },
    {
      name: "an arbitrary MDX package re-export",
      files: {
        "index.md": "---\ntitle: Documentation\n---\n",
        "extension.mdx":
          "---\ntitle: Extension\n---\n\nexport { load } from 'unapproved-package';\n",
      },
      message: /MDX imports.*@astrojs\/starlight\/components/i,
    },
    {
      name: "an authored MDX client application",
      files: {
        "index.md": "---\ntitle: Documentation\n---\n",
        "interactive.mdx":
          "---\ntitle: Interactive\n---\n\nimport { Aside } from '@astrojs/starlight/components';\n\n<Aside client:load>Interactive</Aside>\n",
      },
      message: /client applications/i,
    },
  ];

  for (const invalidSource of invalidSources) {
    const documentationRoot = join(
      makeTemporaryDirectory(),
      "relocated",
      "public-manual",
    );

    for (const [relativePath, contents] of Object.entries(invalidSource.files)) {
      writeTestFile(join(documentationRoot, relativePath), contents);
    }
    writeTestFile(
      join(documentationRoot, "Getting Started", "Installation", "Binary.mdx"),
      "---\ntitle: Binary\n---\n\n<LatestDownloads />\n",
    );

    const preparation = runPreparation(join(documentationRoot, "index.md"));
    assert.notEqual(preparation.status, 0, invalidSource.name);
    assert.match(
      `${preparation.stdout}\n${preparation.stderr}`,
      invalidSource.message,
      invalidSource.name,
    );
  }
});

test("the site build rejects staging changed after documentation preparation", () => {
  const documentationRoot = join(
    makeTemporaryDirectory(),
    "relocated",
    "public-manual",
  );
  writeTestFile(
    join(documentationRoot, "index.md"),
    "---\ntitle: Documentation\n---\n\nControlled content.\n",
  );
  writeTestFile(
    join(documentationRoot, "Getting Started", "Installation", "Binary.mdx"),
    "---\ntitle: Binary\n---\n\n<LatestDownloads />\n",
  );

  const documentationIndex = join(documentationRoot, "index.md");
  const preparation = runPreparation(documentationIndex);
  assert.equal(preparation.status, 0);

  writeTestFile(
    join(stagedDocumentation, "stale-injection.md"),
    "---\ntitle: Stale injection\n---\n\nThis must never ship.\n",
  );

  const build = runNpmScript("build:site", documentationIndex);
  assert.notEqual(build.status, 0);
  assert.match(`${build.stdout}\n${build.stderr}`, /staging.*(changed|contaminated)/i);
});
