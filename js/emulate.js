// Emulate the GitHub API response for testing purposes
// Hardcoded data to simulate a user with a certain account age, number of commits, original repos, and stars
export function fetchGitHubData(username) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        accountAge: 2,
        publicCommits: 50,
        originalRepos: 3,
        stars: 10,
        userInfo: {
          login: username,
          created_at: "2020-01-01T00:00:00Z",
          public_repos: 5,
          followers: 100,
          following: 50,
          totalCommits: 200,
          totalStars: 20,
          avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
          html_url: `https://github.com/${username}`,
        },
      });
    }, 1000);
  });
}
