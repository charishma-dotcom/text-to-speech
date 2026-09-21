const LANGUAGE_CODES = {
  "en-US": "en",
  "en-GB": "en",
  "te-IN": "te",
  "hi-IN": "hi",
  "ta-IN": "ta",
  "kn-IN": "kn",
  "ml-IN": "ml",
  "mr-IN": "mr",
  "gu-IN": "gu",
  "es-ES": "es",
  "fr-FR": "fr",
  "de-DE": "de",
  "it-IT": "it",
  "pt-BR": "pt",
  "ja-JP": "ja",
  "ko-KR": "ko"
};

export async function translateText(
  text,
  targetLanguage
) {
  const targetCode =
    LANGUAGE_CODES[targetLanguage];

  if (!targetCode) {
    throw new Error(
      "Translation is not available for this language."
    );
  }

  if (!text.trim()) {
    throw new Error(
      "Please enter some text to translate."
    );
  }

  // English is already the source language.
  if (targetCode === "en") {
    return text;
  }

  const url =
    "https://api.mymemory.translated.net/get?" +
    new URLSearchParams({
      q: text,
      langpair: `en|${targetCode}`
    });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Translation service is currently unavailable."
    );
  }

  const data = await response.json();

  if (
    data.responseStatus &&
    data.responseStatus !== 200
  ) {
    throw new Error(
      data.responseDetails ||
        "Unable to translate the text."
    );
  }

  const translatedText =
    data?.responseData?.translatedText;

  if (!translatedText) {
    throw new Error(
      "No translation was returned."
    );
  }

  return translatedText;
}