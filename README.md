# Pollinations Seed Tier Dev Points

This project calculates Pollinations Dev Points based on GitHub usernames. It uses the GitHub API to fetch user data and displays the results in a modern web interface.

## Features
- Calculate Dev Points based on GitHub activity.
- Display user details such as profile picture, followers, and repositories.
- Multilingual support with translations for 19 languages.
- Dark theme for better user experience.
- Global and individual progress bars for detailed scoring.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Pollinations-Seed-Tier-Dev-Points.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Pollinations-Seed-Tier-Dev-Points
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Usage

1. Enter a GitHub username in the input field.
2. Click the "Calculate" button.
3. View the user's Dev Points and details.

## Translation

To add or update translations:
1. Edit the `public/langs/en.json` file for English text.
2. Run the `translate_all.sh` script to generate translations for all supported languages:
   ```bash
   bash translate_all.sh
   ```

## Supported Languages
- English (🇬🇧)
- Chinese (🇨🇳)
- Hindi (🇮🇳)
- Spanish (🇪🇸)
- French (🇫🇷)
- Arabic (🇸🇦)
- Bengali (🇧🇩)
- Russian (🇷🇺)
- Portuguese (🇧🇷)
- Urdu (🇵🇰)
- Indonesian (🇮🇩)
- German (🇩🇪)
- Japanese (🇯🇵)
- Swahili (🇹🇿)
- Turkish (🇹🇷)
- Korean (🇰🇷)
- Vietnamese (🇻🇳)
- Italian (🇮🇹)
- Thai (🇹🇭)

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.