// Emulate the GitHub API response for testing purposes
// Hardcoded data to simulate a user with a certain account age, number of commits, original repos, and stars

// Default config values
const defaultConfig = {
  account_age_points_per_month: 0.5,
  public_commits_points_per_commit: 0.1,
  original_repos_points_per_repo: 0.5,
  stars_points_per_star: 0.1,
  max_account_age_points: 6,
  max_public_commits_points: 3,
  max_original_repos_points: 1,
  max_stars_points: 5,
};

export async function fetchGitHubData(username) {
  // Load config
  let config = defaultConfig;
  try {
    const configResponse = await fetch("config.json");
    config = await configResponse.json();
  } catch (err) {
    console.log("Using default config in emulate.js");
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      // Raw values (before capping)
      const rawAccountAgeMonths = 24; // 24 months
      const rawCommits = 50;
      const rawOriginalRepos = 3;
      const rawStars = 10;

      // Calculate points with capping
      const accountAge = Math.min(
        config.max_account_age_points || defaultConfig.max_account_age_points,
        rawAccountAgeMonths *
          (config.account_age_points_per_month ||
            defaultConfig.account_age_points_per_month),
      );
      const publicCommits = Math.min(
        config.max_public_commits_points ||
          defaultConfig.max_public_commits_points,
        rawCommits *
          (config.public_commits_points_per_commit ||
            defaultConfig.public_commits_points_per_commit),
      );
      const originalRepos = Math.min(
        config.max_original_repos_points ||
          defaultConfig.max_original_repos_points,
        rawOriginalRepos *
          (config.original_repos_points_per_repo ||
            defaultConfig.original_repos_points_per_repo),
      );
      const stars = Math.min(
        config.max_stars_points || defaultConfig.max_stars_points,
        rawStars *
          (config.stars_points_per_star || defaultConfig.stars_points_per_star),
      );

      resolve({
        accountAge,
        publicCommits,
        originalRepos,
        stars,
        userInfo: {
          login: username,
          created_at: "2020-01-01T00:00:00Z",
          public_repos: 5,
          followers: 100,
          following: 50,
          totalCommits: rawCommits,
          totalStars: rawStars,
          avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
          html_url: `https://github.com/${username}`,
        },
      });
    }, 1000);
  });
}
