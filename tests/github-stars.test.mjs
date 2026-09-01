import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import {
  githubRepositoryApiUrl,
  updateGithubStars,
} from "../src/lib/github-stars.js";

function createGithubLink(initialCount = "0") {
  const dom = new JSDOM(`
    <a aria-label="stale label">
      <span data-github-stars-count>${initialCount}</span>
    </a>
  `);

  return dom.window.document.querySelector("a");
}

test("GitHub stars update from the public repository API", async () => {
  const githubLink = createGithubLink();
  const requests = [];
  const stars = await updateGithubStars(githubLink, async (resource, options) => {
    requests.push({ resource, options });
    return {
      ok: true,
      json: async () => ({ stargazers_count: 12_345 }),
    };
  });

  assert.equal(stars, 12_345);
  assert.deepEqual(requests, [
    {
      resource: githubRepositoryApiUrl,
      options: { headers: { Accept: "application/vnd.github+json" } },
    },
  ]);
  assert.equal(githubLink.querySelector("[data-github-stars-count]").textContent, "12,345");
  assert.equal(githubLink.getAttribute("aria-label"), "OTTY on GitHub, 12,345 stars");
});

test("GitHub stars remain at zero when the public API is unavailable or invalid", async () => {
  const unavailableResponses = [
    async () => {
      throw new Error("network unavailable");
    },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({ stargazers_count: -1 }) }),
    async () => ({ ok: true, json: async () => ({ stargazers_count: "123" }) }),
  ];

  for (const fetchImplementation of unavailableResponses) {
    const githubLink = createGithubLink("999");
    const stars = await updateGithubStars(githubLink, fetchImplementation);

    assert.equal(stars, 0);
    assert.equal(githubLink.querySelector("[data-github-stars-count]").textContent, "0");
    assert.equal(githubLink.getAttribute("aria-label"), "OTTY on GitHub, 0 stars");
  }
});
