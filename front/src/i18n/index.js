import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

export const LANGUAGES = {
  en: { label: "English", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
};

const STORAGE_KEY = "lang";

function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES[saved]) return saved;
  } catch {
    // storage unavailable
  }
  return navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "en";
}

function applyDocumentLanguage(lng) {
  const html = document.documentElement;
  html.lang = lng;
  html.dir = LANGUAGES[lng]?.dir || "ltr";
}

i18n.on("languageChanged", (lng) => {
  applyDocumentLanguage(lng);
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // storage unavailable
  }
});

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: initialLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
});

applyDocumentLanguage(i18n.language);

export default i18n;
