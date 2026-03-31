const GITHUB_API_BASE_URL = "https://api.github.com";

export async function fetchGitHubData(username) {
  if (!username) {
    alert("Username is required");
    return;
  }

  try {
    const userResponse = await fetch(
      `${GITHUB_API_BASE_URL}/users/${username}`,
    );
    if (!userResponse.ok) {
      if (userResponse.status === 403) {
        const rateLimit = {
          limit: userResponse.headers.get("x-ratelimit-limit"),
          remaining: userResponse.headers.get("x-ratelimit-remaining"),
          reset: userResponse.headers.get("x-ratelimit-reset"),
        };
        const resetTime = new Date(rateLimit.reset * 1000).toLocaleTimeString();
        alert(
          `Rate limit exceeded. Limit: ${rateLimit.limit}, Remaining: ${rateLimit.remaining}. Resets at: ${resetTime}.`,
        );
        console.error("Rate limit details:", rateLimit);
        return;
      }
      throw new Error(`Failed to fetch user data: ${userResponse.status}`);
    }
    const userData = await userResponse.json();

    // Fetch repositories with pagination and 100 per page to avoid silent 30-item cap.
    let reposData = [];
    let page = 1;
    while (true) {
      const reposResponse = await fetch(
        `${GITHUB_API_BASE_URL}/users/${username}/repos?per_page=100&page=${page}`,
      );
      if (!reposResponse.ok) {
        throw new Error("Failed to fetch repositories");
      }
      const pageRepos = await reposResponse.json();
      reposData = reposData.concat(pageRepos);
      if (pageRepos.length < 100) break;
      page += 1;
    }

    const accountAgeMonths = Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(userData.created_at)) /
          (1000 * 60 * 60 * 24 * 30),
      ),
    );
    const accountAge = Math.min(6, accountAgeMonths * 0.5);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Use search API for commits across all public repos and contributions.
    let totalCommitsLast90Days = 0;
    try {
      const commitsSearchResponse = await fetch(
        `${GITHUB_API_BASE_URL}/search/commits?q=author:${encodeURIComponent(
          username,
        )}+committer-date:>${ninetyDaysAgo.toISOString()}&per_page=1`,
        {
          headers: {
            Accept: "application/vnd.github.cloak-preview",
          },
        },
      );
      if (!commitsSearchResponse.ok) {
        throw new Error(
          `Failed to fetch commit search results: ${commitsSearchResponse.status}`,
        );
      }
      const commitsSearchData = await commitsSearchResponse.json();
      totalCommitsLast90Days = commitsSearchData.total_count || 0;
    } catch (err) {
      console.error(`Failed to fetch commit search API: ${err.message}`);
      totalCommitsLast90Days = 0;
    }

    const publicCommits = Math.min(3, totalCommitsLast90Days * 0.1);

    const validOriginalRepos = reposData.filter(
      (repo) =>
        !repo.fork &&
        repo.size > 0 &&
        repo.owner &&
        repo.owner.login.toLowerCase() === username.toLowerCase(),
    );
    const originalReposCount = validOriginalRepos.length;
    const originalRepos = Math.min(1, originalReposCount * 0.5);
    const totalStars = validOriginalRepos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0,
    );
    const stars = Math.min(5, totalStars * 0.1);

    const total = accountAge + publicCommits + originalRepos + stars;

    return {
      accountAge,
      accountAgeMonths,
      publicCommits,
      originalRepos,
      originalReposCount,
      stars,
      total,
      userInfo: {
        login: userData.login,
        created_at: userData.created_at,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        totalCommits: totalCommitsLast90Days,
        totalStars,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
      },
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    alert("Une erreur est survenue. Veuillez réessayer.");
  }
}

export async function checkRateLimit() {
  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}/rate_limit`);
    if (!response.ok) {
      throw new Error(`Failed to fetch rate limit: ${response.status}`);
    }
    const data = await response.json();
    console.log("Rate Limit Data:", data);
    return data;
  } catch (error) {
    console.error("Error checking rate limit:", error);
    alert("Failed to check rate limit. See console for details.");
  }
}
