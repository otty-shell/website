import { spawn } from "node:child_process";

export function runNpmScriptAsync(repositoryRoot, script, environment) {
  return new Promise((resolve) => {
    const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", script], {
      cwd: repositoryRoot,
      env: environment,
    });
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status, signal) => {
      resolve({ status, signal, stdout, stderr });
    });
  });
}
