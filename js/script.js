import { fetchGitHubData as fetchGitHubDataMock } from "./emulate.js";
import { fetchGitHubData as fetchGitHubDataAPI } from "./calculate.js";
import useTranslations from "./i18n.js";

// Default configuration
const defaultConfig = {
  needed_dev_points: 7,
  account_age_points_per_month: 0.5,
  public_commits_points_per_commit: 0.1,
  original_repos_points_per_repo: 0.5,
  stars_points_per_star: 0.1,
  max_account_age_points: 6,
  max_public_commits_points: 3,
  max_original_repos_points: 1,
  max_stars_points: 5,
};

// Config will be loaded asynchronously
let config = null;
let currentTranslations = null;

async function loadConfig() {
  if (config) return config;
  try {
    const configResponse = await fetch("config.json");
    config = await configResponse.json();
    return config;
  } catch (err) {
    console.error("Failed to load config.json, using defaults:", err);
    config = defaultConfig;
    return config;
  }
}

// Déterminer l'environnement à partir des paramètres d'URL
const urlParams = new URLSearchParams(window.location.search);
const env = urlParams.get("env") || "production";
const isDevelopmentEnvironment = env === "dev";

const fetchGitHubData = isDevelopmentEnvironment
  ? fetchGitHubDataMock
  : fetchGitHubDataAPI;

if (isDevelopmentEnvironment) {
  console.log("Running in development environment. Using mock data.");
} else {
  console.log("Running in production environment. Fetching real data.");
}

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.querySelector("#username");
  const calculateButton = document.querySelector("#calculate-button");
  const languageButtons = document.querySelectorAll("button[data-lang]");

  console.log("Initializing event listeners...");

  // Event listener for language buttons
  languageButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const selectedLanguage = button.getAttribute("data-lang");
      console.log(`Language button clicked: ${selectedLanguage}`);

      // Load new translations without page refresh
      const { translations, error } = await useTranslations(selectedLanguage);

      if (error) {
        console.error("Error loading translations:", error);
        return;
      }

      if (!translations) {
        console.error(
          "Translations object is undefined. Check the i18n module.",
        );
        return;
      }

      // Update all translated elements
      document.querySelector("title").textContent = translations.title;
      usernameInput.placeholder = translations.inputPlaceholder;
      calculateButton.textContent = translations.calculateButton;

      // Translate labels
      document.querySelector("#label-user-info").innerHTML =
        `<i class="fas fa-user icon" aria-hidden="true"></i> ${translations.userInfo}`;
      document.querySelector("#label-account-created").textContent =
        translations.accountCreated;
      document.querySelector("#label-followers").textContent =
        translations.followers;
      document.querySelector("#label-following").textContent =
        translations.following;
      document.querySelector("#label-public-repos").textContent =
        translations.publicRepos;
      document.querySelector("#label-commits").textContent =
        translations.totalCommits;
      document.querySelector("#label-stars").textContent = translations.stars;
      document.querySelector("#label-visit-profile").textContent =
        translations.visitProfile;
      document.querySelector("#label-total-score").textContent =
        translations.totalScore;
      document.querySelector("#label-dev-points").innerHTML =
        `<i class="fas fa-code icon" aria-hidden="true"></i> ${translations.devPoints}`;
      document.querySelector("#label-account-age").textContent =
        translations.accountAge;
      document.querySelector("#label-public-commits").textContent =
        translations.publicCommits;
      document.querySelector("#label-original-repos").textContent =
        translations.originalRepos;
      document.querySelector("#label-stars-bar").textContent =
        translations.stars;

      // Update descriptions
      document.querySelector("#desc-account-age").textContent =
        translations.accountAgeDescription;
      document.querySelector("#desc-public-commits").textContent =
        translations.publicCommitsDescription;
      document.querySelector("#desc-original-repos").textContent =
        translations.originalReposDescription;
      document.querySelector("#desc-stars").textContent =
        translations.starsDescription;

      // Update the URL without page refresh
      const url = new URL(window.location);
      url.searchParams.set("lang", selectedLanguage);
      window.history.pushState({}, "", url);
    });
  });

  console.log("Language button event listeners initialized.");

  // Event listener for calculate button
  calculateButton.addEventListener("click", async () => {
    console.log("Calculate button clicked");
    const username = usernameInput.value;
    if (!username) {
      console.error("Username input is empty");
      return;
    }
    console.log(`Calculating dev points for username: ${username}`);
    await calculateDevPoints(username);
  });

  console.log("Calculate button event listener initialized.");

  // Fix for autofillFieldData.autoCompleteType null issue
  const autofillFieldData = document.querySelector("#username");
  if (autofillFieldData) {
    const autoCompleteType = autofillFieldData.autoCompleteType || "";
    console.log("Autofill field data detected:", autoCompleteType);

    if (autoCompleteType.includes("username")) {
      console.log("AutoCompleteType includes 'username'");
    } else {
      console.log("AutoCompleteType does not include 'username'");
    }
  } else {
    console.warn("autofillFieldData is null or undefined.");
  }

  const language =
    urlParams.get("lang") || navigator.language.split("-")[0] || "en";

  useTranslations(language).then(({ translations, error }) => {
    if (error) {
      console.error("Error loading translations:", error);
      return;
    }

    if (!translations) {
      console.error("Translations object is undefined. Check the i18n module.");
      return;
    }

    console.log("Translations loaded:", translations);

    document.querySelector("title").textContent = translations.title;
    usernameInput.placeholder = translations.inputPlaceholder;
    calculateButton.textContent = translations.calculateButton;

    // Translate labels
    document.querySelector("#label-user-info").innerHTML =
      `<i class="fas fa-user icon" aria-hidden="true"></i> ${translations.userInfo}`;
    document.querySelector("#label-account-created").textContent =
      translations.accountCreated;
    document.querySelector("#label-followers").textContent =
      translations.followers;
    document.querySelector("#label-following").textContent =
      translations.following;
    document.querySelector("#label-public-repos").textContent =
      translations.publicRepos;
    document.querySelector("#label-commits").textContent =
      translations.totalCommits;
    document.querySelector("#label-stars").textContent = translations.stars;
    document.querySelector("#label-visit-profile").textContent =
      translations.visitProfile;
    document.querySelector("#label-total-score").textContent =
      translations.totalScore;
    document.querySelector("#label-dev-points").innerHTML =
      `<i class="fas fa-code icon" aria-hidden="true"></i> ${translations.devPoints}`;
    document.querySelector("#label-account-age").textContent =
      translations.accountAge;
    document.querySelector("#label-public-commits").textContent =
      translations.publicCommits;
    document.querySelector("#label-original-repos").textContent =
      translations.originalRepos;
    document.querySelector("#label-stars-bar").textContent = translations.stars;

    // Update descriptions
    document.querySelector("#desc-account-age").textContent =
      translations.accountAgeDescription;
    document.querySelector("#desc-public-commits").textContent =
      translations.publicCommitsDescription;
    document.querySelector("#desc-original-repos").textContent =
      translations.originalReposDescription;
    document.querySelector("#desc-stars").textContent =
      translations.starsDescription;

    currentTranslations = translations;
  });

  // Ensure stylesheets are fully loaded before proceeding
  document.fonts.ready
    .then(() => {
      console.log("All fonts and stylesheets are loaded.");
    })
    .catch((err) => {
      console.warn("Error waiting for fonts or stylesheets to load:", err);
    });
});

async function calculateDevPoints(username) {
  console.log(`Starting calculation for: ${username}`);

  // Load config first
  const cfg = await loadConfig();

  const updateUI = (data) => {
    userInfo.avatar.src = data.userInfo.avatar_url;
    userInfo.login.textContent = data.userInfo.login;
    userInfo.created.textContent = new Date(
      data.userInfo.created_at,
    ).toLocaleDateString();
    userInfo.repos.textContent = data.userInfo.public_repos;
    userInfo.followers.textContent = data.userInfo.followers;
    userInfo.following.textContent = data.userInfo.following;
    userInfo.profile.href = data.userInfo.html_url;
    userInfo.commits.textContent = data.userInfo.totalCommits;
    userInfo.stars.textContent = data.userInfo.totalStars;

    // Normalize progress bars based on max values from config
    const maxAccountAge =
      cfg.max_account_age_points || defaultConfig.max_account_age_points;
    const maxPublicCommits =
      cfg.max_public_commits_points || defaultConfig.max_public_commits_points;
    const maxOriginalRepos =
      cfg.max_original_repos_points || defaultConfig.max_original_repos_points;
    const maxStars = cfg.max_stars_points || defaultConfig.max_stars_points;
    const neededPoints =
      cfg.needed_dev_points || defaultConfig.needed_dev_points;

    progressBars.accountAge.style.width = `${(data.accountAge / maxAccountAge) * 100}%`;
    progressBars.publicCommits.style.width = `${(data.publicCommits / maxPublicCommits) * 100}%`;
    progressBars.originalRepos.style.width = `${(data.originalRepos / maxOriginalRepos) * 100}%`;
    progressBars.stars.style.width = `${(data.stars / maxStars) * 100}%`;

    const accountAgePerMonth =
      cfg.account_age_points_per_month ||
      defaultConfig.account_age_points_per_month;
    const publicCommitsPerCommit =
      cfg.public_commits_points_per_commit ||
      defaultConfig.public_commits_points_per_commit;
    const originalReposPerRepo =
      cfg.original_repos_points_per_repo ||
      defaultConfig.original_repos_points_per_repo;
    const starsPerStar =
      cfg.stars_points_per_star || defaultConfig.stars_points_per_star;

    const accountAgeDetail = document.querySelector("#account-age-detail");
    const publicCommitsDetail = document.querySelector(
      "#public-commits-detail",
    );
    const originalReposDetail = document.querySelector(
      "#original-repos-detail",
    );
    const starsDetail = document.querySelector("#stars-detail");

    const accountAgeUnit =
      (currentTranslations && currentTranslations.accountAgeUnit) || "mo";
    const publicCommitsUnit =
      (currentTranslations && currentTranslations.publicCommitsUnit) ||
      "commits";
    const originalReposUnit =
      (currentTranslations && currentTranslations.originalReposUnit) || "repos";
    const starsUnit =
      (currentTranslations && currentTranslations.starsUnit) || "stars";

    if (accountAgeDetail) {
      accountAgeDetail.textContent = `${accountAgePerMonth} × ${data.accountAgeMonths} ${accountAgeUnit} = ${data.accountAge.toFixed(1)} pts`;
    }
    if (publicCommitsDetail) {
      publicCommitsDetail.textContent = `${publicCommitsPerCommit} × ${data.userInfo.totalCommits} ${publicCommitsUnit} = ${data.publicCommits.toFixed(1)} pts`;
    }
    if (originalReposDetail) {
      originalReposDetail.textContent = `${originalReposPerRepo} × ${data.originalReposCount} ${originalReposUnit} = ${data.originalRepos.toFixed(1)} pts`;
    }
    if (starsDetail) {
      starsDetail.textContent = `${starsPerStar} × ${data.userInfo.totalStars} ${starsUnit} = ${data.stars.toFixed(1)} pts`;
    }

    // Calculate total score (sum of points)
    const totalPoints =
      data.accountAge + data.publicCommits + data.originalRepos + data.stars;
    const totalPointsDisplay = document.querySelector("#total-points");
    if (totalPointsDisplay) {
      totalPointsDisplay.textContent = totalPoints.toFixed(1);
    }
    if (progressBars.total) {
      // Progress bar shows progress toward the threshold of needed points
      const progressPercentage = Math.min(
        100,
        (totalPoints / neededPoints) * 100,
      );
      progressBars.total.style.width = `${progressPercentage}%`;
    }

    // Ensure the results section is visible
    const resultsSection = document.querySelector("#results");
    if (resultsSection) {
      resultsSection.style.display = "block";
    }
  };

  try {
    if (isDevelopmentEnvironment) {
      console.log(
        "Development environment detected. Using hardcoded results from emulate.js.",
      );
      const hardcodedResult = await fetchGitHubData(username);
      console.log("Hardcoded Result:", hardcodedResult);
      updateUI(hardcodedResult);
    } else {
      console.log(
        "Production environment detected. Fetching real data from GitHub.",
      );
      const data = await fetchGitHubData(username);
      console.log("Fetched data:", data);
      updateUI(data);
    }
  } catch (error) {
    console.error("Error fetching data from GitHub:", error);
  }
}

const userInfo = {
  avatar: document.querySelector("#avatar"),
  login: document.querySelector("#user-login"),
  created: document.querySelector("#user-created"),
  repos: document.querySelector("#user-repos"),
  followers: document.querySelector("#user-followers"),
  following: document.querySelector("#user-following"),
  profile: document.querySelector("#user-profile"),
  commits: document.querySelector("#user-commits"),
  stars: document.querySelector("#user-stars"),
};

const progressBars = {
  accountAge: document.querySelector("#account-age-bar"),
  publicCommits: document.querySelector("#public-commits-bar"),
  originalRepos: document.querySelector("#original-repos-bar"),
  stars: document.querySelector("#stars-bar"),
  total: document.querySelector("#total-score-bar"),
};
