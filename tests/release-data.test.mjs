import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { writeTestFile } from "./helpers/filesystem.mjs";
import { runNpmScriptAsync } from "./helpers/process.mjs";
import { withReleaseApi } from "./helpers/release-api.mjs";
import { readStableReleaseFixture } from "./helpers/release-fixture.mjs";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const generator = join(repositoryRoot, "scripts", "generate-release-data.mjs");
const generatedReleaseData = join(repositoryRoot, ".generated", "release-data.json");
const releaseDataStageManifest = join(
  repositoryRoot,
  ".generated",
  "release-data-stage.json",
);
const temporaryRoots = [];

function makeTemporaryDirectory() {
  const directory = mkdtempSync(join(tmpdir(), "otty-release-data-"));
  temporaryRoots.push(directory);
  return directory;
}

function release({
  tag = "v1.2.3",
  draft = false,
  prerelease = false,
  publishedAt = "2026-08-30T14:25:00Z",
  assets = requiredAssets("1.2.3"),
} = {}) {
  return {
    tag_name: tag,
    draft,
    prerelease,
    published_at: publishedAt,
    html_url: `https://github.com/otty-shell/otty/releases/tag/${tag}`,
    assets,
  };
}

function requiredAssets(version) {
  const tag = `v${version}`;
  const filenames = [
    `otty_${version}-amd64.deb`,
    `otty_${version}-x86_64.rpm`,
    `otty_${version}-aarch64-apple-darwin.dmg`,
    `otty_${version}-x86_64-apple-darwin.dmg`,
  ];

  return filenames.map((name, index) => ({
    name,
    size: 10_000_000 + index * 1_250_000,
    browser_download_url: `https://github.com/otty-shell/otty/releases/download/${tag}/${name}`,
  }));
}

function generate(releases) {
  const directory = makeTemporaryDirectory();
  const input = join(directory, "releases.json");
  const output = join(directory, "release-data.json");
  writeTestFile(input, `${JSON.stringify(releases, null, 2)}\n`);

  const result = spawnSync(process.execPath, [generator, input, output], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });

  return {
    ...result,
    data: result.status === 0 ? JSON.parse(readFileSync(output, "utf8")) : undefined,
  };
}

function prepareRelease(source, environmentOverrides = {}) {
  const environment = { ...process.env };
  delete environment.CI;
  delete environment.GITHUB_ACTIONS;

  if (source === undefined) {
    delete environment.OTTY_RELEASE_SOURCE;
  } else {
    environment.OTTY_RELEASE_SOURCE = source;
  }
  Object.assign(environment, environmentOverrides);

  return spawnSync(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["run", "prepare:release"],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
      env: environment,
    },
  );
}

function prepareReleaseAsync(source, environmentOverrides = {}) {
  const environment = { ...process.env, ...environmentOverrides };
  delete environment.CI;
  delete environment.GITHUB_ACTIONS;

  if (source === undefined) {
    delete environment.OTTY_RELEASE_SOURCE;
  } else {
    environment.OTTY_RELEASE_SOURCE = source;
  }

  return runNpmScriptAsync(repositoryRoot, "prepare:release", environment);
}

test.after(async () => {
  for (const directory of temporaryRoots) {
    rmSync(directory, { recursive: true, force: true });
  }

  const restoration = await prepareReleaseAsync("fixture");
  assert.equal(
    restoration.status,
    0,
    `release stage restoration failed\n\nstdout:\n${restoration.stdout}\n\nstderr:\n${restoration.stderr}`,
  );
});

test("release generation selects the latest published stable release and emits current methods", () => {
  const stable = release();
  stable.assets.push({
    name: "checksums.txt",
    size: 512,
    browser_download_url:
      "https://github.com/otty-shell/otty/releases/download/v1.2.3/checksums.txt",
  });

  const generation = generate([
    release({ tag: "v2.0.0", draft: true, assets: requiredAssets("2.0.0") }),
    release({
      tag: "v1.3.0-beta.1",
      prerelease: true,
      assets: requiredAssets("1.3.0-beta.1"),
    }),
    stable,
    release({ tag: "v1.1.0", assets: requiredAssets("1.1.0") }),
  ]);

  assert.equal(
    generation.status,
    0,
    `release generation failed\n\nstdout:\n${generation.stdout}\n\nstderr:\n${generation.stderr}`,
  );
  assert.deepEqual(generation.data, {
    version: "1.2.3",
    publishedAt: "2026-08-30T14:25:00Z",
    releaseNotesUrl: "https://github.com/otty-shell/otty/releases/tag/v1.2.3",
    allReleasesUrl: "https://github.com/otty-shell/otty/releases",
    methods: [
      {
        kind: "release-asset",
        group: "Linux",
        platform: "Debian or Ubuntu-style Linux",
        architecture: "x86-64",
        format: "deb",
        filename: "otty_1.2.3-amd64.deb",
        sizeBytes: 10_000_000,
        browser_download_url:
          "https://github.com/otty-shell/otty/releases/download/v1.2.3/otty_1.2.3-amd64.deb",
      },
      {
        kind: "release-asset",
        group: "Linux",
        platform: "RPM-based Linux",
        architecture: "x86-64",
        format: "rpm",
        filename: "otty_1.2.3-x86_64.rpm",
        sizeBytes: 11_250_000,
        browser_download_url:
          "https://github.com/otty-shell/otty/releases/download/v1.2.3/otty_1.2.3-x86_64.rpm",
      },
      {
        kind: "release-asset",
        group: "macOS",
        platform: "macOS",
        architecture: "Apple Silicon",
        format: "dmg",
        filename: "otty_1.2.3-aarch64-apple-darwin.dmg",
        sizeBytes: 12_500_000,
        browser_download_url:
          "https://github.com/otty-shell/otty/releases/download/v1.2.3/otty_1.2.3-aarch64-apple-darwin.dmg",
      },
      {
        kind: "release-asset",
        group: "macOS",
        platform: "macOS",
        architecture: "Intel",
        format: "dmg",
        filename: "otty_1.2.3-x86_64-apple-darwin.dmg",
        sizeBytes: 13_750_000,
        browser_download_url:
          "https://github.com/otty-shell/otty/releases/download/v1.2.3/otty_1.2.3-x86_64-apple-darwin.dmg",
      },
    ],
  });
});

test("release generation rejects input without a selectable stable release", () => {
  for (const releases of [
    [],
    [release({ draft: true })],
    [release({ tag: "v1.3.0-beta.1", prerelease: true, assets: requiredAssets("1.3.0-beta.1") })],
  ]) {
    const generation = generate(releases);
    assert.notEqual(generation.status, 0);
    assert.match(`${generation.stdout}\n${generation.stderr}`, /no published stable GitHub Release/i);
  }
});

test("release generation rejects invalid or prerelease versions selected as stable", () => {
  for (const tag of ["1.2.3", "v1.2", "v01.2.3", "v1.2.3-beta.1"]) {
    const generation = generate([release({ tag })]);
    assert.notEqual(generation.status, 0, tag);
    assert.match(`${generation.stdout}\n${generation.stderr}`, /strict stable v<SemVer>/i, tag);
  }
});

test("release generation rejects missing, mismatched, and duplicate required assets", () => {
  const missing = requiredAssets("1.2.3").slice(0, -1);
  const mismatched = requiredAssets("1.2.3");
  mismatched[1] = { ...mismatched[1], name: "otty-1.2.3.x86_64.rpm" };
  const duplicate = requiredAssets("1.2.3");
  duplicate.push({ ...duplicate[0] });

  for (const [name, assets] of [
    ["missing", missing],
    ["mismatched", mismatched],
    ["duplicate", duplicate],
  ]) {
    const generation = generate([release({ assets })]);
    assert.notEqual(generation.status, 0, name);
    assert.match(`${generation.stdout}\n${generation.stderr}`, /exactly one required asset/i, name);
  }
});

test("release generation rejects invalid direct URLs and byte sizes", () => {
  const invalidUrl = requiredAssets("1.2.3");
  invalidUrl[0] = {
    ...invalidUrl[0],
    browser_download_url:
      "https://downloads.example.test/otty/releases/otty_1.2.3-amd64.deb",
  };
  const invalidSize = requiredAssets("1.2.3");
  invalidSize[0] = { ...invalidSize[0], size: 0 };

  for (const [name, assets, message] of [
    ["URL", invalidUrl, /direct GitHub asset URL/i],
    ["size", invalidSize, /positive byte size/i],
  ]) {
    const generation = generate([release({ assets })]);
    assert.notEqual(generation.status, 0, name);
    assert.match(`${generation.stdout}\n${generation.stderr}`, message, name);
  }
});

test("release generation rejects invalid publication dates and release-notes destinations", () => {
  const invalidDate = generate([release({ publishedAt: "2026-02-30T14:25:00Z" })]);
  assert.notEqual(invalidDate.status, 0);
  assert.match(`${invalidDate.stdout}\n${invalidDate.stderr}`, /published_at/i);

  const invalidReleaseNotes = release();
  invalidReleaseNotes.html_url = "https://example.test/release-notes";
  const invalidDestination = generate([invalidReleaseNotes]);
  assert.notEqual(invalidDestination.status, 0);
  assert.match(`${invalidDestination.stdout}\n${invalidDestination.stderr}`, /html_url/i);
});

test("local release preparation supports an explicit fixture fallback", () => {
  const unsupported = prepareRelease("live");
  assert.notEqual(unsupported.status, 0);
  assert.match(`${unsupported.stdout}\n${unsupported.stderr}`, /OTTY_RELEASE_SOURCE.*fixture/is);

  const fixture = prepareRelease("fixture");
  assert.equal(
    fixture.status,
    0,
    `release preparation failed\n\nstdout:\n${fixture.stdout}\n\nstderr:\n${fixture.stderr}`,
  );
  const data = JSON.parse(readFileSync(generatedReleaseData, "utf8"));
  assert.equal(data.version, "0.2.0");
  assert.equal(data.methods.length, 4);
});

test("local release preparation defaults to GitHub's latest release", async () => {
  const stableRelease = readStableReleaseFixture(repositoryRoot);

  await withReleaseApi({ body: JSON.stringify(stableRelease) }, async ({ apiUrl, requests }) => {
    const preparation = await prepareReleaseAsync(undefined, {
      OTTY_GITHUB_RELEASES_API_URL: apiUrl,
    });

    assert.equal(
      preparation.status,
      0,
      `release preparation failed\n\nstdout:\n${preparation.stdout}\n\nstderr:\n${preparation.stderr}`,
    );
    assert.equal(requests.length, 1);

    const data = JSON.parse(readFileSync(generatedReleaseData, "utf8"));
    assert.equal(data.version, "0.2.0");
    assert.equal(data.methods.length, 4);
  });
});

test("local release preparation rejects fixture selection in CI", () => {
  const fixtureInCi = prepareRelease("fixture", { CI: "true" });
  assert.notEqual(fixtureInCi.status, 0);
  assert.match(`${fixtureInCi.stdout}\n${fixtureInCi.stderr}`, /local-only.*CI/i);
});

test("live release preparation requests GitHub's latest release and emits validated data", async () => {
  const stableRelease = readStableReleaseFixture(repositoryRoot);

  await withReleaseApi({ body: JSON.stringify(stableRelease) }, async ({ apiUrl, requests }) => {
    const preparation = await prepareReleaseAsync("github", {
      OTTY_GITHUB_RELEASES_API_URL: apiUrl,
    });

    assert.equal(
      preparation.status,
      0,
      `release preparation failed\n\nstdout:\n${preparation.stdout}\n\nstderr:\n${preparation.stderr}`,
    );
    assert.equal(requests.length, 1);
    assert.equal(requests[0].method, "GET");
    assert.equal(requests[0].url, "/repos/otty-shell/otty/releases/latest");
    assert.equal(requests[0].headers.accept, "application/vnd.github+json");
    assert.equal(requests[0].headers["x-github-api-version"], "2026-03-10");
    assert.match(requests[0].headers["user-agent"], /otty-website/i);

    const data = JSON.parse(readFileSync(generatedReleaseData, "utf8"));
    assert.equal(data.version, "0.2.0");
    assert.equal(data.methods.length, 4);
  });
});

test("live release preparation fails closed for unavailable or invalid API data", async () => {
  const invalidMatrix = release();
  invalidMatrix.assets[1] = {
    ...invalidMatrix.assets[1],
    name: "otty-1.2.3.x86_64.rpm",
  };
  const cases = [
    {
      name: "API failure",
      response: { status: 503, body: JSON.stringify({ message: "unavailable" }) },
      message: /GitHub Releases API request failed.*503/i,
    },
    {
      name: "invalid JSON",
      response: { body: "{" },
      message: /GitHub Releases API returned invalid JSON/i,
    },
    {
      name: "malformed response",
      response: { body: JSON.stringify([]) },
      message: /latest Release API response must be a JSON object/i,
    },
    {
      name: "prerelease-only response",
      response: {
        body: JSON.stringify(
          release({
            tag: "v1.3.0-beta.1",
            prerelease: true,
            assets: requiredAssets("1.3.0-beta.1"),
          }),
        ),
      },
      message: /no published stable GitHub Release/i,
    },
    {
      name: "invalid package matrix",
      response: { body: JSON.stringify(invalidMatrix) },
      message: /exactly one required asset.*rpm/i,
    },
  ];

  for (const invalidCase of cases) {
    const fixture = prepareRelease("fixture");
    assert.equal(fixture.status, 0, invalidCase.name);
    assert.equal(existsSync(generatedReleaseData), true, invalidCase.name);
    assert.equal(existsSync(releaseDataStageManifest), true, invalidCase.name);

    await withReleaseApi(invalidCase.response, async ({ apiUrl }) => {
      const preparation = await prepareReleaseAsync("github", {
        OTTY_GITHUB_RELEASES_API_URL: apiUrl,
      });

      assert.notEqual(preparation.status, 0, invalidCase.name);
      assert.match(
        `${preparation.stdout}\n${preparation.stderr}`,
        invalidCase.message,
        invalidCase.name,
      );
      assert.equal(existsSync(generatedReleaseData), false, invalidCase.name);
      assert.equal(existsSync(releaseDataStageManifest), false, invalidCase.name);
    });
  }
});
