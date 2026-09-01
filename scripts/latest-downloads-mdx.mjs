import { createProcessor } from "@mdx-js/mdx";

const importStatement =
  "import LatestDownloads from '/src/components/LatestDownloads.astro';";
const importNode = createProcessor().parse(importStatement).children[0];

export function latestDownloadsMdx() {
  return (tree) => {
    if (containsLatestDownloads(tree)) {
      tree.children.unshift(structuredClone(importNode));
    }
  };
}

function containsLatestDownloads(node) {
  if (!node || typeof node !== "object") return false;
  if (node.name === "LatestDownloads") return true;
  return (node.children ?? []).some(containsLatestDownloads);
}
