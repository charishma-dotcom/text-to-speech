import { useEffect, useMemo, useState } from "react";

import DownloadButton from "./components/DownloadButton";
import Auth from "./components/Auth";
import TextInput from "./components/TextInput";
import LanguageSelector from "./components/LanguageSelector";
import VoiceSelector from "./components/VoiceSelector";
import GenerateButton from "./components/GenerateButton";
import AudioPlayer from "./components/AudioPlayer";
import FileUpload from "./components/FileUpload";
import SpeechHistory from "./components/SpeechHistory";
import ErrorMessage from "./components/ErrorMessage";
import TranslateButton from "./components/TranslateButton";

import { translateText } from "./services/translationService";

import "./App.css";

const LANGUAGES = [
  {
    code: "en-US",
    name: "English (United States)"
  },
  {
    code: "en-GB",
    name: "English (United Kingdom)"
  },
  {
    code: "te-IN",
    name: "Telugu (India)"
  },
  {
    code: "hi-IN",
    name: "Hindi (India)"
  },
  {
    code: "ta-IN",
    name: "Tamil (India)"
  },
  {
    code: "kn-IN",
    name: "Kannada (India)"
  },
  {
    code: "ml-IN",
    name: "Malayalam (India)"
  },
  {
    code: "mr-IN",
    name: "Marathi (India)"
  },
  {
    code: "gu-IN",
    name: "Gujarati (India)"
  },
  {
    code: "es-ES",
    name: "Spanish"
  },
  {
    code: "fr-FR",
    name: "French"
  },
  {
    code: "de-DE",
    name: "German"
  },
  {
    code: "it-IT",
    name: "Italian"
  },
  {
    code: "pt-BR",
    name: "Portuguese"
  },
  {
    code: "ja-JP",
    name: "Japanese"
  },
  {
    code: "ko-KR",
    name: "Korean"
  }
];

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("tts_current_user")
      );
    } catch {
      return null;
    }
  });

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <SpeechApplication
      user={user}
      onLogout={() => {
        window.speechSynthesis?.cancel();

        localStorage.removeItem(
          "tts_current_user"
        );

        setUser(null);
      }}
    />
  );
}

function SpeechApplication({ user, onLogout }) {
  const [text, setText] = useState("");

  const [translatedText, setTranslatedText] =
    useState("");

  const [isTranslating, setIsTranslating] =
    useState(false);

  const [voices, setVoices] = useState([]);

  const [selectedLanguage, setSelectedLanguage] =
    useState("en-US");

  const [selectedVoiceName, setSelectedVoiceName] =
    useState("");

  const [rate, setRate] = useState(1);

  const [pitch, setPitch] = useState(1);

  const [volume, setVolume] = useState(1);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [error, setError] = useState("");

  const [lastSpokenText, setLastSpokenText] =
    useState("");

  const [history, setHistory] = useState([]);

  const [activeTab, setActiveTab] =
    useState("generator");

  const [isLoadingFile, setIsLoadingFile] =
    useState(false);
    

  const browserSupported =
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;
    

  /*
   * Load user history.
   */
  useEffect(() => {
    const key = `tts_history_${user.email}`;

    try {
      const saved =
        JSON.parse(localStorage.getItem(key)) || [];

      setHistory(saved);
    } catch {
      setHistory([]);
    }
  }, [user.email]);

  /*
   * Save history.
   */
  useEffect(() => {
    localStorage.setItem(
      `tts_history_${user.email}`,
      JSON.stringify(history)
    );
  }, [history, user.email]);

  /*
   * Load browser voices.
   */
  useEffect(() => {
    if (!browserSupported) {
      setError(
        "Your browser does not support Text-to-Speech."
      );

      return;
    }

    const loadVoices = () => {
      const available =
        window.speechSynthesis.getVoices();

      setVoices(available);
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );
    };
  }, [browserSupported]);

  /*
   * Get voices for selected language.
   */
  const filteredVoices = useMemo(() => {
    const languagePrefix =
      selectedLanguage
        .split("-")[0]
        .toLowerCase();

    const exact = voices.filter(
      (voice) =>
        voice.lang.toLowerCase() ===
        selectedLanguage.toLowerCase()
    );

    const sameLanguage = voices.filter(
      (voice) =>
        voice.lang
          .toLowerCase()
          .startsWith(languagePrefix + "-")
    );

    const result = [
      ...exact,
      ...sameLanguage.filter(
        (voice) =>
          !exact.some(
            (existing) =>
              existing.name === voice.name &&
              existing.lang === voice.lang
          )
      )
    ];

    return result;
  }, [voices, selectedLanguage]);

  /*
   * Automatically choose first voice.
   */
  useEffect(() => {
    if (!filteredVoices.length) {
      setSelectedVoiceName("");
      return;
    }

    const exists = filteredVoices.some(
      (voice) =>
        voice.name === selectedVoiceName
    );

    if (!exists) {
      const defaultVoice =
        filteredVoices.find(
          (voice) => voice.default
        ) || filteredVoices[0];

      setSelectedVoiceName(
        defaultVoice.name
      );
    }
  }, [
    filteredVoices,
    selectedVoiceName
  ]);

  /*
   * Change language.
   */
  const handleLanguageChange = (language) => {
    stopSpeech();

    setSelectedLanguage(language);

    setTranslatedText("");

    setError("");
  };

  /*
   * Translate text.
   */
  const handleTranslate = async () => {
    setError("");

    const cleanText = text.trim();

    if (!cleanText) {
      setError(
        "Please enter some text first."
      );

      return;
    }

    /*
     * English does not need translation.
     */
    if (
      selectedLanguage === "en-US" ||
      selectedLanguage === "en-GB"
    ) {
      setTranslatedText(cleanText);
      return;
    }

    setIsTranslating(true);

    try {
      const result = await translateText(
        cleanText,
        selectedLanguage
      );

      setTranslatedText(result);
    } catch (translationError) {
      setError(
        translationError.message ||
          "Translation failed."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  /*
   * Generate speech.
   */
  const handleGenerate = () => {
    setError("");

    if (!browserSupported) {
      setError(
        "Your browser does not support Text-to-Speech."
      );

      return;
    }

    /*
     * If translated text exists,
     * speak the translated text.
     *
     * Otherwise speak original text.
     */
    const cleanText =
      translatedText.trim() ||
      text.trim();

    if (!cleanText) {
      setError(
        "Please enter some text."
      );

      return;
    }

    if (!filteredVoices.length) {
      setError(
        `No ${selectedLanguage} voice is available on this device.`
      );

      return;
    }

    const voice =
      filteredVoices.find(
        (item) =>
          item.name === selectedVoiceName
      ) || filteredVoices[0];

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        cleanText
      );

    utterance.voice = voice;

    utterance.lang = selectedLanguage;

    utterance.rate = Number(rate);

    utterance.pitch = Number(pitch);

    utterance.volume = Number(volume);

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setIsPaused(false);

      if (event.error !== "canceled") {
        setError(
          "Unable to play the selected voice."
        );
      }
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    setLastSpokenText(cleanText);

    window.speechSynthesis.speak(
      utterance
    );

    /*
     * Save speech history.
     */
    const historyItem = {
      id: crypto.randomUUID(),

      text: cleanText,

      language: selectedLanguage,

      languageName:
        LANGUAGES.find(
          (item) =>
            item.code === selectedLanguage
        )?.name || selectedLanguage,

      voice: voice.name,

      voiceLanguage: voice.lang,

      rate: Number(rate),

      pitch: Number(pitch),

      volume: Number(volume),

      createdAt:
        new Date().toISOString(),

      favorite: false
    };

    setHistory((previous) => [
      historyItem,
      ...previous
    ]);
  };

  /*
   * Pause speech.
   */
  const pauseSpeech = () => {
    if (
      window.speechSynthesis.speaking
    ) {
      window.speechSynthesis.pause();

      setIsPaused(true);
    }
  };

  /*
   * Resume speech.
   */
  const resumeSpeech = () => {
    if (
      window.speechSynthesis.paused
    ) {
      window.speechSynthesis.resume();

      setIsPaused(false);
    }
  };

  /*
   * Stop speech.
   */
  const stopSpeech = () => {
    window.speechSynthesis.cancel();

    setIsSpeaking(false);

    setIsPaused(false);
  };

  /*
   * Replay history item.
   */
  const replayHistory = (item) => {
    setText(item.text);

    setTranslatedText(item.text);

    setSelectedLanguage(
      item.language
    );

    setRate(item.rate ?? 1);

    setPitch(item.pitch ?? 1);

    setVolume(item.volume ?? 1);

    const voiceExists =
      voices.some(
        (voice) =>
          voice.name === item.voice
      );

    if (voiceExists) {
      setSelectedVoiceName(
        item.voice
      );
    }

    setTimeout(() => {
      const availableVoice =
        voices.find(
          (voice) =>
            voice.name === item.voice
        );

      if (!availableVoice) {
        setError(
          "The original voice is no longer available."
        );

        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          item.text
        );

      utterance.voice =
        availableVoice;

      utterance.lang =
        item.language;

      utterance.rate =
        item.rate ?? 1;

      utterance.pitch =
        item.pitch ?? 1;

      utterance.volume =
        item.volume ?? 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(
        utterance
      );
    }, 100);
  };

  /*
   * Favorite.
   */
  const toggleFavorite = (id) => {
    setHistory((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite: !item.favorite
            }
          : item
      )
    );
  };

  /*
   * Delete history.
   */
  const deleteHistory = (id) => {
    setHistory((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  /*
   * Handle uploaded file text.
   */
  const handleExtractedText = (
    extractedText
  ) => {
    setText(extractedText);

    setTranslatedText("");

    setActiveTab("generator");

    setError("");
  };

  /*
   * Main application UI.
   */
  return (
    <div className="app">

      <header className="top-header">

        <div className="brand">

          <div className="brand-icon">
            🔊
          </div>

          <div>
            <h1>
              Text to Speech
            </h1>

            <p>
              Free multilingual speech
              generator
            </p>
          </div>

        </div>

        <div className="header-user">

          <span>
            {user.name}
          </span>

          <button
            onClick={onLogout}
            className="logout-button"
          >
            Logout
          </button>

        </div>

      </header>

      <nav className="navigation">

        <button
          className={
            activeTab === "generator"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setActiveTab("generator")
          }
        >
          🎙 Generator
        </button>

        <button
          className={
            activeTab === "upload"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setActiveTab("upload")
          }
        >
          📁 Upload
        </button>

        <button
          className={
            activeTab === "history"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setActiveTab("history")
          }
        >
          🕘 History
        </button>

      </nav>

      <main className="main-container">

        {activeTab === "generator" && (
          <>

            <section className="hero-section">

              <h2>
                Convert Text Into Speech
              </h2>

              <p>
                Choose your language and
                available voice, customize
                the sound, and speak.
              </p>

            </section>

            <section className="tts-card">

              <TextInput
                text={text}

                setText={(value) => {
                  setText(value);

                  /*
                   * Clear old translation when
                   * user changes the text.
                   */
                  setTranslatedText("");
                }}

                onClear={() => {
                  stopSpeech();

                  setText("");

                  setTranslatedText("");

                  setLastSpokenText("");

                  setError("");
                }}
              />

              <div className="settings-grid">

                <LanguageSelector
                  languages={LANGUAGES}

                  selectedLanguage={
                    selectedLanguage
                  }

                  onChange={
                    handleLanguageChange
                  }
                />

                <VoiceSelector
                  voices={filteredVoices}

                  selectedVoice={
                    selectedVoiceName
                  }

                  onChange={
                    setSelectedVoiceName
                  }

                  allVoices={voices}
                />

              </div>

              <div className="customization">

                <h3>
                  Audio Customization
                </h3>

                <div className="slider-grid">

                  <label>

                    <span>
                      Speed:{" "}
                      {Number(rate).toFixed(1)}
                    </span>

                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={rate}
                      onChange={(event) =>
                        setRate(
                          event.target.value
                        )
                      }
                    />

                  </label>

                  <label>

                    <span>
                      Pitch:{" "}
                      {Number(pitch).toFixed(1)}
                    </span>

                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={pitch}
                      onChange={(event) =>
                        setPitch(
                          event.target.value
                        )
                      }
                    />

                  </label>

                  <label>

                    <span>
                      Volume:{" "}
                      {Number(volume).toFixed(1)}
                    </span>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(event) =>
                        setVolume(
                          event.target.value
                        )
                      }
                    />

                  </label>

                </div>

              </div>

              <TranslateButton
                onClick={handleTranslate}
                loading={isTranslating}
                disabled={
                  !text.trim() ||
                  selectedLanguage === "en-US" ||
                  selectedLanguage === "en-GB"
                }
              />

              {translatedText && (
  
  <div
    style={{
      marginTop: "16px",
      padding: "18px 20px",
      border: "1px solid #d8def5",
      borderRadius: "12px",
      background:
        "linear-gradient(135deg, #f8f9ff 0%, #f1f4ff 100%)",
      boxShadow:
        "0 4px 12px rgba(88, 110, 232, 0.08)"
    }}
  >
    <div
      style={{
        marginBottom: "10px",
        color: "#586ee8",
        fontSize: "14px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "7px"
      }}
    >
      <span>🌐</span>
      <span>Translated Text</span>
      
    </div>

    <div
      style={{
        padding: "14px 16px",
        borderRadius: "9px",
        background: "#ffffff",
        border: "1px solid #e2e6f5",
        color: "#20283a",
        fontSize: "17px",
        lineHeight: "1.7",
        minHeight: "52px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      }}
    >
      {translatedText}
    </div>
  </div>
)}

              <GenerateButton
                onClick={handleGenerate}
                disabled={
                  !text.trim() ||
                  !filteredVoices.length
                }
              />

              <AudioPlayer
                isSpeaking={
                  isSpeaking
                }

                isPaused={
                  isPaused
                }

                onPause={
                  pauseSpeech
                }

                onResume={
                  resumeSpeech
                }

                onStop={
                  stopSpeech
                }

                text={
                  lastSpokenText
                }
              />

              <DownloadButton
                text={
                  lastSpokenText ||
                  translatedText ||
                  text
                }
              />

              <ErrorMessage
                message={error}
              />

              {!filteredVoices.length &&
                voices.length > 0 && (
                  <div className="warning">

                    ⚠️ No voice for{" "}

                    {
                      LANGUAGES.find(
                        (item) =>
                          item.code ===
                          selectedLanguage
                      )?.name
                    }{" "}

                    is available on
                    this device.

                  </div>
                )}

              {!voices.length && (
                <div className="loading-message">
                  Loading available
                  browser voices...
                </div>
              )}

            </section>

          </>
        )}

        {activeTab === "upload" && (

          <section className="page-card">

            <h2>
              Upload Text File
            </h2>

            <p>
              Upload TXT, PDF or DOCX and
              extract the text automatically.
            </p>

            <FileUpload
              onTextExtracted={
                handleExtractedText
              }

              setLoading={
                setIsLoadingFile
              }
            />

            {isLoadingFile && (
              <div className="loading-message">
                Extracting text...
              </div>
            )}

          </section>

        )}

        {activeTab === "history" && (

          <SpeechHistory
  history={history}
  onReplay={replayHistory}
  onFavorite={toggleFavorite}
  onDelete={deleteHistory}
  onClear={() => {
    setHistory((previous) =>
      previous.filter((item) => item.favorite)
    );
  }}
  userEmail={user.email}
/>

        )}

      </main>

      <footer className="footer">
        <p>
          Free Text-to-Speech Application
        </p>
      </footer>

    </div>
  );
}

export default App;