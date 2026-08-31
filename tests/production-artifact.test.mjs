import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const artifactPath = join(repositoryRoot, "dist");

function readArtifact(relativePath) {
  return readFileSync(join(artifactPath, relativePath), "utf8");
}

function htmlBeforeClientJavaScript(relativePath) {
  return readArtifact(relativePath).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

test("the production build emits the canonical static site", () => {
  rmSync(artifactPath, { recursive: true, force: true });

  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const build = spawnSync(npm, ["run", "build"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });

  assert.equal(
    build.status,
    0,
    `production build failed\n\nstdout:\n${build.stdout}\n\nstderr:\n${build.stderr}`,
  );

  const landing = htmlBeforeClientJavaScript("index.html");
  const documentation = htmlBeforeClientJavaScript("docs/index.html");
  const installation = htmlBeforeClientJavaScript("docs/install/index.html");

  assert.match(landing, /<h1[^>]*>\s*OTTY\s*<\/h1>/);
  assert.match(landing, /Terminal-first Workspace/i);
  assert.match(landing, /href="\/"[^>]*>[\s\S]*?OTTY/);
  assert.match(landing, /href="\/docs\/"/);
  assert.match(landing, /href="\/docs\/install\/"/);
  assert.match(landing, /href="https:\/\/otty\.run\/"[^>]*rel="canonical"/);

  assert.match(documentation, /<h1[^>]*[^>]*>Documentation<\/h1>/);
  assert.match(documentation, /href="\/"/);
  assert.match(documentation, /href="\/docs\/install\/"/);
  assert.match(documentation, /https:\/\/otty\.run\/docs\//);

  assert.match(installation, /<h1[^>]*[^>]*>Installation and Downloads<\/h1>/);
  assert.match(installation, /href="\/"/);
  assert.match(installation, /href="\/docs\/"/);
  assert.match(installation, /https:\/\/otty\.run\/docs\/install\//);

  for (const asset of ["logo-full.svg", "logo-small.svg", "otty.png"]) {
    assert.equal(existsSync(join(artifactPath, "assets", asset)), true);
  }

  assert.equal(readArtifact("CNAME"), "otty.run\n");
  assert.equal(existsSync(join(artifactPath, "server")), false);
});
