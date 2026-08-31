import generatedReleaseData from "../../.generated/release-data.json";

interface InstallationMethodBase {
  group: string;
  platform: string;
  architecture: string;
  format: string;
}

export interface ReleaseAssetInstallationMethod extends InstallationMethodBase {
  kind: "release-asset";
  filename: string;
  sizeBytes: number;
  browser_download_url: string;
}

export interface CommandInstallationMethod extends InstallationMethodBase {
  kind: "command";
  command: string;
}

export interface ExternalInstallationMethod extends InstallationMethodBase {
  kind: "external";
  destination: string;
  url: string;
}

export type InstallationMethod =
  | ReleaseAssetInstallationMethod
  | CommandInstallationMethod
  | ExternalInstallationMethod;

export interface PublishedReleaseData {
  version: string;
  publishedAt: string;
  releaseNotesUrl: string;
  allReleasesUrl: string;
  methods: InstallationMethod[];
}

export const releaseData = generatedReleaseData as PublishedReleaseData;
