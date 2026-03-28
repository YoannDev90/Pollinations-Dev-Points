#!/bin/bash

# This script translates a given English JSON file into all supported languages using LibreTranslate.

# Check if LibreTranslate is running
if ! curl -s http://localhost:5000/health | grep -q "ok"; then
  echo "LibreTranslate is not running. Please start it first."
  exit 1
fi

# LibreTranslate API endpoint
API_URL="http://localhost:5000/translate"

# List of target languages (ISO 639-1 codes)
LANGUAGES=(
  "ar" "bn" "zh" "fr" "de" "hi" "id" "it" "ja" "ko" "pt" "ru" "es" "sw" "th" "tr" "ur" "vi"
)

# Path to the English JSON file
EN_FILE="public/langs/en.json"

# Check if the file exists
if [ ! -f "$EN_FILE" ]; then
  echo "English JSON file not found: $EN_FILE"
  exit 1
fi

# Read and translate each key-value pair
for LANG in "${LANGUAGES[@]}"; do
  echo "Translating to $LANG..."
  OUTPUT_FILE="public/langs/$LANG.json"
  echo "{" > "$OUTPUT_FILE"

  # Extract each key-value pair
  jq -r 'to_entries[] | "\(.key)=\(.value)"' "$EN_FILE" | while IFS="=" read -r KEY VALUE; do
    # Translate the value
    RESPONSE=$(curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "{\"q\": \"$VALUE\", \"source\": \"en\", \"target\": \"$LANG\"}")

    TRANSLATED_TEXT=$(echo "$RESPONSE" | jq -r '.translatedText')

    # Write the translated key-value pair to the output file
    echo "  \"$KEY\": \"$TRANSLATED_TEXT\"," >> "$OUTPUT_FILE"
  done

  # Close the JSON object
  sed -i '$ s/,$//' "$OUTPUT_FILE" # Remove the trailing comma
  echo "}" >> "$OUTPUT_FILE"
done

echo "Translation completed!"