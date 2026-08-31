import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repository = "otty-shell/otty";
const githubOrigin = "https://github.com";
const allReleasesUrl = `${githubOrigin}/${repository}/releases`;
const stableSemver =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export function generateReleaseDataFile(inputPath, outputPath) {
  const releases = readJson(inputPath);
  const releaseData = selectAndValidatePublishedRelease(releases);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(releaseData, null, 2)}\n`);
}

export function selectAndValidatePublishedRelease(releases) {
  if (!Array.isArray(releases)) {
    throw new Error("Release input must be a GitHub Releases JSON array.");
  }

  const selectedRelease = releases.find(
    (release) => release?.draft === false && release?.prerelease === false,
  );

  if (!selectedRelease) {
    throw new Error("Release input contains no published stable GitHub Release.");
  }

  const tag = requiredString(selectedRelease.tag_name, "tag_name");
  const version = tag.startsWith("v") ? tag.slice(1) : "";

  if (!stableSemver.test(version)) {
    throw new Error(`Selected release tag ${JSON.stringify(tag)} must be strict stable v<SemVer>.`);
  }

  const publishedAt = validatePublishedAt(selectedRelease.published_at);
  const releaseNotesUrl = `${allReleasesUrl}/tag/${tag}`;

  if (selectedRelease.html_url !== releaseNotesUrl) {
    throw new Error(`Selected release html_url must be ${releaseNotesUrl}.`);
  }

  if (!Array.isArray(selectedRelease.assets)) {
    throw new Error("Selected release assets must be an array.");
  }

  const methodDefinitions = [
    {
      group: "Linux",
      platform: "Debian or Ubuntu-style Linux",
      architecture: "x86-64",
      format: "deb",
      filename: `otty_${version}_amd64.deb`,
    },
    {
      group: "Linux",
      platform: "RPM-based Linux",
      architecture: "x86-64",
      format: "rpm",
      filename: `otty-${version}-1.x86_64.rpm`,
    },
    {
      group: "macOS",
      platform: "macOS",
      architecture: "Apple Silicon",
      format: "dmg",
      filename: `otty_${version}-aarch64-apple-darwin.dmg`,
    },
    {
      group: "macOS",
      platform: "macOS",
      architecture: "Intel",
      format: "dmg",
      filename: `otty_${version}-x86_64-apple-darwin.dmg`,
    },
  ];

  const methods = methodDefinitions.map((definition) => {
    const matchingAssets = selectedRelease.assets.filter(
      (asset) => asset?.name === definition.filename,
    );

    if (matchingAssets.length !== 1) {
      throw new Error(
        `Selected release must contain exactly one required asset named ${definition.filename}; found ${matchingAssets.length}.`,
      );
    }

    const asset = matchingAssets[0];
    const expectedDownloadUrl = `${allReleasesUrl}/download/${tag}/${definition.filename}`;

    if (asset.browser_download_url !== expectedDownloadUrl) {
      throw new Error(
        `Required asset ${definition.filename} must have direct GitHub asset URL ${expectedDownloadUrl}.`,
      );
    }

    if (!Number.isSafeInteger(asset.size) || asset.size <= 0) {
      throw new Error(`Required asset ${definition.filename} must have a positive byte size.`);
    }

    return {
      kind: "release-asset",
      ...definition,
      sizeBytes: asset.size,
      browser_download_url: asset.browser_download_url,
    };
  });

  return {
    version,
    publishedAt,
    releaseNotesUrl,
    allReleasesUrl,
    methods,
  };
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (cause) {
    throw new Error(`Release input at ${path} is missing or invalid JSON.`, { cause });
  }
}

function requiredString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Selected release ${field} must be a non-empty string.`);
  }

  return value;
}

function validatePublishedAt(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value) ||
    new Date(value).toISOString() !== value.replace("Z", ".000Z")
  ) {
    throw new Error("Selected release published_at must be a valid GitHub UTC timestamp.");
  }

  return value;
}

const executedPath = process.argv[1] ? resolve(process.argv[1]) : undefined;

if (executedPath === fileURLToPath(import.meta.url)) {
  const [, , inputArgument, outputArgument] = process.argv;

  if (!inputArgument || !outputArgument) {
    throw new Error(
      "Usage: node scripts/generate-release-data.mjs <GitHub Releases JSON> <generated JSON>",
    );
  }

  generateReleaseDataFile(resolve(inputArgument), resolve(outputArgument));
}
