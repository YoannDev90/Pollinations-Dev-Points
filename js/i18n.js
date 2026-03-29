const useTranslations = async (language) => {
  const translations = {};
  let error = null;

  try {
    console.log(`Fetching translations for language: ${language}`);
    const response = await fetch(`/langs/${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch translations for ${language}`);
    }
    const data = await response.json();
    Object.assign(translations, data);
    console.log("Translations fetched successfully:", translations);
  } catch (err) {
    console.error("Error loading translations:", err);
    error = err;
  }

  return { translations, error };
};

export default useTranslations;
