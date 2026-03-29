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

    const reposResponse = await fetch(
      `${GITHUB_API_BASE_URL}/users/${username}/repos`,
    );
    if (!reposResponse.ok) {
      throw new Error("Failed to fetch repositories");
    }
    const reposData = await reposResponse.json();

    const accountAge = Math.min(
      6,
      Math.floor(
        (Date.now() - new Date(userData.created_at)) /
          (1000 * 60 * 60 * 24 * 30),
      ) * 0.5,
    );

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    let totalCommitsLast90Days = 0;

    const commitPromises = reposData.map(async (repo) => {
      if (!repo.fork) {
        try {
          const commitsResponse = await fetch(
            `${GITHUB_API_BASE_URL}/repos/${username}/${repo.name}/commits?since=${ninetyDaysAgo.toISOString()}`,
          );
          if (!commitsResponse.ok) {
            throw new Error(`Failed to fetch commits for repo ${repo.name}`);
          }
          const commitsData = await commitsResponse.json();
          return commitsData.length;
        } catch (err) {
          console.error(
            `Failed to fetch commits for repo ${repo.name}: ${err.message}`,
          );
          return 0;
        }
      }
      return 0;
    });

    const commitResults = await Promise.all(commitPromises);
    totalCommitsLast90Days = commitResults.reduce(
      (sum, count) => sum + count,
      0,
    );

    const publicCommits = Math.min(3, totalCommitsLast90Days * 0.1);

    const originalRepos = Math.min(
      1,
      reposData.filter((repo) => !repo.fork).length * 0.5,
    );
    const stars = Math.min(
      5,
      reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0) * 0.1,
    );

    const totalStars = reposData.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0,
    );

    const total = accountAge + publicCommits + originalRepos + stars;

    return {
      accountAge,
      publicCommits,
      originalRepos,
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
