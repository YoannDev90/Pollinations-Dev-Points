import { fetchGitHubData as fetchGitHubDataMock } from "./emulate.js";
import { fetchGitHubData as fetchGitHubDataAPI } from "./calculate.js";
import useTranslations from "./i18n.js";

// Déterminer l'environnement à partir des paramètres d'URL
const urlParams = new URLSearchParams(window.location.search);
const env = urlParams.get("env") || "production";
const isDevelopmentEnvironment = env === "development";

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
    button.addEventListener("click", (event) => {
      const selectedLanguage = event.target.getAttribute("data-lang");
      console.log(`Language button clicked: ${selectedLanguage}`);
      // Reload the page with the selected language as a query parameter
      const url = new URL(window.location);
      url.searchParams.set("lang", selectedLanguage);
      window.location.href = url;
    });
  });

  console.log("Language button event listeners initialized.");

  // Event listener for calculate button
  calculateButton.addEventListener("click", () => {
    console.log("Calculate button clicked");
    const username = usernameInput.value;
    if (!username) {
      console.error("Username input is empty");
      return;
    }
    console.log(`Calculating dev points for username: ${username}`);
    calculateDevPoints(username);
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

  const language = navigator.language.split("-")[0] || "en";
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

function calculateDevPoints(username) {
  console.log(`Starting calculation for: ${username}`);

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

    progressBars.accountAge.style.width = `${data.accountAge * 20}%`;
    progressBars.publicCommits.style.width = `${data.publicCommits * 20}%`;
    progressBars.originalRepos.style.width = `${data.originalRepos * 20}%`;
    progressBars.stars.style.width = `${data.stars * 20}%`;

    // Ensure the results section is visible
    const resultsSection = document.querySelector("#results");
    if (resultsSection) {
      resultsSection.style.display = "block";
    }
  };

  if (isDevelopmentEnvironment) {
    console.log(
      "Development environment detected. Using hardcoded results from emulate.js.",
    );
    fetchGitHubData(username).then((hardcodedResult) => {
      console.log("Hardcoded Result:", hardcodedResult);
      updateUI(hardcodedResult);
      return hardcodedResult;
    });
  } else {
    console.log(
      "Production environment detected. Fetching real data from GitHub.",
    );
    fetchGitHubData(username)
      .then((data) => {
        console.log("Fetched data:", data);
        updateUI(data);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching data from GitHub:", error);
      });
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
};

const progressBars = {
  accountAge: document.querySelector("#account-age-bar"),
  publicCommits: document.querySelector("#public-commits-bar"),
  originalRepos: document.querySelector("#original-repos-bar"),
  stars: document.querySelector("#stars-bar"),
};
