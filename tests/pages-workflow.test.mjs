import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { load as loadYaml } from "js-yaml";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workflowPath = join(repositoryRoot, ".github", "workflows", "pages.yml");

function readWorkflow() {
  return loadYaml(readFileSync(workflowPath, "utf8"));
}

test("Pages synchronization runs hourly and for website main changes while cancelling obsolete runs", () => {
  const workflow = readWorkflow();

  assert.deepEqual(workflow.on.push.branches, ["main"]);
  assert.deepEqual(workflow.on.schedule, [{ cron: "17 * * * *" }]);
  assert.equal(workflow.on.workflow_dispatch, null);
  assert.deepEqual(workflow.concurrency, {
    group: "pages",
    "cancel-in-progress": true,
  });
});

test("the read-only build job synchronizes live inputs through the shared production path", () => {
  const workflow = readWorkflow();
  const build = workflow.jobs.build;

  assert.deepEqual(workflow.permissions, { contents: "read" });
  assert.deepEqual(build.permissions, { contents: "read" });
  assert.equal(build.environment, undefined);

  const checkouts = build.steps.filter((step) => step.uses?.startsWith("actions/checkout@"));
  assert.equal(checkouts.length, 2);
  assert.deepEqual(checkouts[0].with, { "persist-credentials": false });
  assert.deepEqual(checkouts[1].with, {
    repository: "otty-shell/otty",
    ref: "main",
    path: ".otty-source",
    "persist-credentials": false,
  });

  const nodeSetup = build.steps.find((step) => step.uses?.startsWith("actions/setup-node@"));
  assert.deepEqual(nodeSetup.with, { "node-version": 22, cache: "npm" });
  assert.ok(build.steps.find((step) => step.run === "npm ci"));

  const productionBuild = build.steps.find((step) => step.run === "npm run build");
  assert.deepEqual(productionBuild.env, {
    OTTY_SOURCE_DIR: "${{ github.workspace }}/.otty-source",
    OTTY_RELEASE_SOURCE: "github",
    GITHUB_TOKEN: "${{ github.token }}",
  });

  const upload = build.steps.find((step) =>
    step.uses?.startsWith("actions/upload-pages-artifact@"),
  );
  assert.deepEqual(upload.with, {
    name: "github-pages",
    path: "dist",
    "retention-days": 1,
  });
  assert.ok(build.steps.indexOf(productionBuild) < build.steps.indexOf(upload));
  assert.equal(build.steps.some((step) => step.uses?.startsWith("actions/deploy-pages@")), false);
  assert.equal(build.steps.some((step) => step["continue-on-error"] === true), false);
  assert.doesNotMatch(JSON.stringify(workflow), /fixture/i);
});

test("only the dependent deployment job can publish the completed Pages artifact", () => {
  const workflow = readWorkflow();
  const deployment = workflow.jobs.deploy;

  assert.equal(deployment.needs, "build");
  assert.equal(deployment.if, undefined);
  assert.deepEqual(deployment.permissions, {
    pages: "write",
    "id-token": "write",
  });
  assert.deepEqual(deployment.environment, {
    name: "github-pages",
    url: "${{ steps.deployment.outputs.page_url }}",
  });
  assert.deepEqual(deployment.steps, [
    {
      name: "Deploy completed production artifact",
      id: "deployment",
      uses: "actions/deploy-pages@v4",
      with: { artifact_name: "github-pages" },
    },
  ]);

  const authoritativeJobs = Object.values(workflow.jobs).filter(
    (job) => job.permissions?.pages === "write" || job.permissions?.["id-token"] === "write",
  );
  assert.deepEqual(authoritativeJobs, [deployment]);
});
