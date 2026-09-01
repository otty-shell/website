import {
  cpSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import { createProcessor } from "@mdx-js/mdx";
import { load as loadYaml } from "js-yaml";
import {
  describeDocumentationStage,
  documentationStageManifest,
  stagedDocumentation,
} from "./documentation-stage.mjs";

const documentationExtensions = new Set([
  ".markdown",
  ".mdown",
  ".mkdn",
  ".mkd",
  ".mdwn",
  ".md",
  ".mdx",
]);
const supportedMdxImport = "@astrojs/starlight/components";
const binaryInstallationPage = "Getting Started/Installation/Binary.mdx";
const mdxProcessor = createProcessor();

const documentationIndexInput = process.env.OTTY_DOCUMENTATION_INDEX?.trim();

if (!documentationIndexInput) {
  throw new Error(
    "OTTY_DOCUMENTATION_INDEX is required to prepare the Public Documentation Source.",
  );
}

if (!isAbsolute(documentationIndexInput)) {
  throw new Error("OTTY_DOCUMENTATION_INDEX must be an absolute path to index.md.");
}

const documentationIndex = resolve(documentationIndexInput);

if (basename(documentationIndex) !== "index.md") {
  throw new Error("OTTY_DOCUMENTATION_INDEX must point to a file named index.md.");
}

const publicDocumentationSource = dirname(documentationIndex);

rmSync(stagedDocumentation, { recursive: true, force: true });
rmSync(documentationStageManifest, { force: true });

try {
  if (!statSync(documentationIndex).isFile()) {
    throw new Error("not a file");
  }
} catch (cause) {
  throw new Error(
    `Documentation index not found at ${documentationIndex}. OTTY_DOCUMENTATION_INDEX must point to the Public Documentation Source index.md.`,
    { cause },
  );
}

const sourceFiles = listSourceFiles(publicDocumentationSource);

for (const sourceFile of sourceFiles) {
  if (!documentationExtensions.has(extname(sourceFile).toLowerCase())) continue;
  validateDocumentationPage(sourceFile);
}

validateInstallationPage(sourceFiles);

cpSync(publicDocumentationSource, stagedDocumentation, { recursive: true });
mkdirSync(dirname(documentationStageManifest), { recursive: true });
writeFileSync(
  documentationStageManifest,
  `${JSON.stringify({ version: 1, files: describeDocumentationStage() }, null, 2)}\n`,
);

function listSourceFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);

    if (entry.isSymbolicLink()) {
      throw new Error(
        `Public Documentation Source must not contain symbolic links: ${relative(publicDocumentationSource, entryPath)}`,
      );
    }

    if (entry.isDirectory()) {
      files.push(...listSourceFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function validateDocumentationPage(path) {
  const relativePath = relative(publicDocumentationSource, path);
  const contents = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  const frontmatterMatch = contents.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);

  if (!frontmatterMatch) {
    throw new Error(`${relativePath} must define non-empty title frontmatter.`);
  }

  let frontmatter;

  try {
    frontmatter = loadYaml(frontmatterMatch[1]);
  } catch (cause) {
    throw new Error(`${relativePath} has invalid YAML frontmatter.`, { cause });
  }

  if (
    typeof frontmatter !== "object" ||
    frontmatter === null ||
    typeof frontmatter.title !== "string" ||
    frontmatter.title.trim() === ""
  ) {
    throw new Error(`${relativePath} must define non-empty title frontmatter.`);
  }

  if (extname(path).toLowerCase() === ".mdx") {
    validateMdx(relativePath, contents.slice(frontmatterMatch[0].length));
  }
}

function validateMdx(relativePath, body) {
  const mdxTree = parseMdx(relativePath, body);

  visitMdxNodes(mdxTree, (node) => {
    visitEstreeNodes(node.data?.estree, (estreeNode) => {
      if (estreeNode.type === "ImportExpression") {
        throwUnsupportedMdxImport(relativePath);
      }

      if (
        ["ImportDeclaration", "ExportAllDeclaration", "ExportNamedDeclaration"].includes(
          estreeNode.type,
        ) &&
        typeof estreeNode.source?.value === "string" &&
        estreeNode.source.value !== supportedMdxImport
      ) {
        throwUnsupportedMdxImport(relativePath);
      }
    });

    if (
      node.name?.toLowerCase() === "script" ||
      node.attributes?.some(
        (attribute) =>
          typeof attribute.name === "string" && attribute.name.toLowerCase().startsWith("client:"),
      )
    ) {
      throw new Error(
        `${relativePath} defines an authored client application. Client applications are not supported.`,
      );
    }
  });
}

function validateInstallationPage(sourceFiles) {
  const installationPage = sourceFiles.find(
    (path) =>
      relative(publicDocumentationSource, path).split(sep).join("/") ===
      binaryInstallationPage,
  );

  if (!installationPage) {
    throw new Error(
      `${binaryInstallationPage} is required for the authored Binary installation page.`,
    );
  }

  const contents = readFileSync(installationPage, "utf8").replace(/^\uFEFF/, "");
  const frontmatterMatch = contents.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  const mdxTree = parseMdx(
    binaryInstallationPage,
    contents.slice(frontmatterMatch?.[0].length ?? 0),
  );
  const components = [];

  visitMdxNodes(mdxTree, (node) => {
    if (
      ["mdxJsxFlowElement", "mdxJsxTextElement"].includes(node.type) &&
      node.name === "LatestDownloads"
    ) {
      components.push(node);
    }
  });

  if (components.length !== 1) {
    throw new Error(
      `${binaryInstallationPage} must contain exactly one LatestDownloads component; found ${components.length}.`,
    );
  }

  if ((components[0].attributes?.length ?? 0) > 0) {
    throw new Error(
      "LatestDownloads does not accept authored attributes; release facts come from generated data.",
    );
  }

  if ((components[0].children?.length ?? 0) > 0) {
    throw new Error("LatestDownloads must be empty and self-closing.");
  }
}

function parseMdx(relativePath, body) {
  try {
    return mdxProcessor.parse(body);
  } catch (cause) {
    throw new Error(`${relativePath} contains invalid MDX.`, { cause });
  }
}

function throwUnsupportedMdxImport(relativePath) {
  throw new Error(
    `${relativePath} uses an unsupported MDX import. MDX imports are limited to ${supportedMdxImport}.`,
  );
}

function visitMdxNodes(node, visitor) {
  if (!node || typeof node !== "object") return;
  visitor(node);

  for (const child of node.children ?? []) {
    visitMdxNodes(child, visitor);
  }
}

function visitEstreeNodes(node, visitor) {
  if (!node || typeof node !== "object") return;
  visitor(node);

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) visitEstreeNodes(child, visitor);
    } else if (value && typeof value === "object") {
      visitEstreeNodes(value, visitor);
    }
  }
}
