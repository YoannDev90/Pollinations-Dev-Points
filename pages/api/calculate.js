import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const axiosInstance = axios.create({
  headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {},
});

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const userResponse = await axiosInstance.get(
      `https://api.github.com/users/${username}`,
    );
    const reposResponse = await axiosInstance.get(
      `https://api.github.com/users/${username}/repos`,
    );

    const accountAge = Math.min(
      6,
      Math.floor(
        (new Date() - new Date(userResponse.data.created_at)) /
          (1000 * 60 * 60 * 24 * 30),
      ) * 0.5,
    );

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    let totalCommitsLast90Days = 0;

    const commitPromises = reposResponse.data.map(async (repo) => {
      if (!repo.fork) {
        try {
          const commitsResponse = await axiosInstance.get(
            `https://api.github.com/repos/${username}/${repo.name}/commits?since=${ninetyDaysAgo.toISOString()}`,
          );
          return commitsResponse.data.length;
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
      reposResponse.data.filter((repo) => !repo.fork).length * 0.5,
    );
    const stars = Math.min(
      5,
      reposResponse.data.reduce((sum, repo) => sum + repo.stargazers_count, 0) *
        0.1,
    );

    const totalStars = reposResponse.data.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0,
    );

    const total = accountAge + publicCommits + originalRepos + stars;

    res.status(200).json({
      accountAge,
      publicCommits,
      originalRepos,
      stars,
      total,
      userInfo: {
        login: userResponse.data.login,
        created_at: userResponse.data.created_at,
        public_repos: userResponse.data.public_repos,
        followers: userResponse.data.followers,
        following: userResponse.data.following,
        totalCommits: totalCommitsLast90Days,
        totalStars,
        avatar_url: userResponse.data.avatar_url,
        html_url: userResponse.data.html_url,
      },
    });
  } catch (error) {
    console.error(`Error in /api/calculate: ${error.message}`);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "GitHub user not found" });
    } else {
      res.status(500).json({
        error: "Failed to fetch data from GitHub",
        details: error.message,
      });
    }
  }
}
