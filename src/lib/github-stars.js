export const githubRepositoryApiUrl = "https://api.github.com/repos/otty-shell/otty";

const numberFormatter = new Intl.NumberFormat("en-US");

export async function updateGithubStars(githubLink, fetchImplementation = globalThis.fetch) {
  const count = githubLink?.querySelector("[data-github-stars-count]");

  if (!githubLink || !count) return 0;

  renderGithubStars(githubLink, count, 0);

  try {
    const response = await fetchImplementation(githubRepositoryApiUrl, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) return 0;

    const repository = await response.json();
    const stars = repository?.stargazers_count;

    if (!Number.isSafeInteger(stars) || stars < 0) return 0;

    renderGithubStars(githubLink, count, stars);
    return stars;
  } catch {
    return 0;
  }
}

function renderGithubStars(githubLink, count, stars) {
  const formattedStars = numberFormatter.format(stars);
  const unit = stars === 1 ? "star" : "stars";

  count.textContent = formattedStars;
  githubLink.setAttribute("aria-label", `OTTY on GitHub, ${formattedStars} ${unit}`);
}
