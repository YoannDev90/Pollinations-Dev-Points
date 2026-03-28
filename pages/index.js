import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [username, setUsername] = useState("");
  const [devPoints, setDevPoints] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        const response = await axios.get(`${basePath}/langs/${language}.json`);
        setTranslations(response.data);
      } catch (err) {
        console.error("Error loading translations:", err);
      }
    };
    fetchTranslations();
  }, [language]);

  const calculateDevPoints = async () => {
    try {
      setError(null);
      const response = await axios.get(`/api/calculate?username=${username}`);
      setDevPoints(response.data);
      setUserInfo(response.data.userInfo);
    } catch (err) {
      setError(translations.error || "An error occurred.");
    }
  };

  const calculateOverallScore = (devPoints) => {
    if (!devPoints) return 0;
    return (
      devPoints.accountAge +
      devPoints.publicCommits +
      devPoints.originalRepos +
      devPoints.stars
    );
  };

  const ProgressBar = ({ value, max }) => {
    const percentage = (value / max) * 100;
    return (
      <div
        style={{
          width: "100%",
          backgroundColor: "#333",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "15px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #1db954, #1ed760)",
            height: "25px",
            borderRadius: "10px",
            transition: "width 0.3s ease-in-out",
          }}
        ></div>
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto",
        backgroundColor: "#121212",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        color: "#e0e0e0",
      }}
    >
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {[
            { lang: "en", emoji: "🇬🇧" },
            { lang: "zh", emoji: "🇨🇳" },
            { lang: "hi", emoji: "🇮🇳" },
            { lang: "es", emoji: "🇪🇸" },
            { lang: "fr", emoji: "🇫🇷" },
            { lang: "ar", emoji: "🇸🇦" },
            { lang: "bn", emoji: "🇧🇩" },
            { lang: "ru", emoji: "🇷🇺" },
            { lang: "pt", emoji: "🇧🇷" },
            { lang: "ur", emoji: "🇵🇰" },
            { lang: "id", emoji: "🇮🇩" },
            { lang: "de", emoji: "🇩🇪" },
            { lang: "ja", emoji: "🇯🇵" },
            { lang: "sw", emoji: "🇹🇿" },
            { lang: "tr", emoji: "🇹🇷" },
            { lang: "ko", emoji: "🇰🇷" },
            { lang: "vi", emoji: "🇻🇳" },
            { lang: "it", emoji: "🇮🇹" },
            { lang: "th", emoji: "🇹🇭" },
          ].map(({ lang, emoji }) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
                padding: "10px",
                borderRadius: "50%",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <h1
        style={{
          color: "#1db954",
          marginBottom: "30px",
          fontSize: "2.5rem",
          fontWeight: "bold",
        }}
      >
        {translations.title || "Loading..."}
      </h1>
      <input
        type="text"
        placeholder={translations.inputPlaceholder || ""}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "15px",
          fontSize: "18px",
          marginRight: "10px",
          width: "70%",
          border: "1px solid #444",
          borderRadius: "8px",
          outline: "none",
          backgroundColor: "#1e1e1e",
          color: "#e0e0e0",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      />
      <button
        onClick={calculateDevPoints}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          backgroundColor: "#1db954",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#17a74a")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#1db954")}
      >
        {translations.calculateButton || "Calculate"}
      </button>
      {userInfo && (
        <div
          style={{
            marginTop: "30px",
            textAlign: "left",
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h2
            style={{
              color: "#1db954",
              fontSize: "1.8rem",
              marginBottom: "20px",
            }}
          >
            {translations.userInfo || "User Info"}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={userInfo.avatar_url}
              alt="GitHub Avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                marginRight: "20px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            />
            <div>
              <p>
                <strong>{translations.username || "Username"}:</strong>{" "}
                {userInfo.login}
              </p>
              <p>
                <strong>
                  {translations.accountCreated || "Account Created"}:
                </strong>{" "}
                {new Date(userInfo.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p>
            <strong>{translations.publicRepos || "Public Repos"}:</strong>{" "}
            {userInfo.public_repos}
          </p>
          <p>
            <strong>{translations.followers || "Followers"}:</strong>{" "}
            {userInfo.followers}
          </p>
          <p>
            <strong>{translations.following || "Following"}:</strong>{" "}
            {userInfo.following}
          </p>
          <p>
            <strong>
              {translations.totalCommits || "Total Commits (last 90 days)"}:
            </strong>{" "}
            {userInfo.totalCommits}
          </p>
          <p>
            <strong>{translations.totalStars || "Total Stars"}:</strong>{" "}
            {userInfo.totalStars}
          </p>
          <p>
            <strong>GitHub Profile:</strong>{" "}
            <a
              href={userInfo.html_url}
              target="_blank"
              style={{ color: "#1db954" }}
            >
              {userInfo.html_url}
            </a>
          </p>
        </div>
      )}
      {devPoints && (
        <div style={{ marginBottom: "30px" }}>
          <h2
            style={{
              color: "#1db954",
              fontSize: "1.5rem",
              marginBottom: "10px",
            }}
          >
            Overall Progress: {calculateOverallScore(devPoints)} / 7
          </h2>
          <ProgressBar value={calculateOverallScore(devPoints)} max={7} />
        </div>
      )}
      {devPoints && (
        <div
          style={{
            marginTop: "30px",
            textAlign: "left",
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h2
            style={{
              color: "#1db954",
              fontSize: "1.8rem",
              marginBottom: "20px",
            }}
          >
            {translations.devPoints}: {devPoints.total}
          </h2>
          <div>
            <p style={{ marginBottom: "5px", fontWeight: "bold" }}>
              {translations.accountAge}: {devPoints.accountAge} points
            </p>
            <ProgressBar value={devPoints.accountAge} max={6} />
          </div>
          <div>
            <p style={{ marginBottom: "5px", fontWeight: "bold" }}>
              {translations.publicCommits}: {devPoints.publicCommits.toFixed(1)}{" "}
              points
            </p>
            <ProgressBar value={devPoints.publicCommits} max={3} />
          </div>
          <div>
            <p style={{ marginBottom: "5px", fontWeight: "bold" }}>
              {translations.originalRepos}: {devPoints.originalRepos} points
            </p>
            <ProgressBar value={devPoints.originalRepos} max={1} />
          </div>
          <div>
            <p style={{ marginBottom: "5px", fontWeight: "bold" }}>
              {translations.stars}: {devPoints.stars} points
            </p>
            <ProgressBar value={devPoints.stars} max={5} />
          </div>
        </div>
      )}
      {error && (
        <p style={{ color: "red", marginTop: "20px", fontWeight: "bold" }}>
          {error}
        </p>
      )}
    </div>
  );
}
