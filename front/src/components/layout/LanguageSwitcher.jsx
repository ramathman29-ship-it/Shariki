import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { LANGUAGES } from "@/i18n";

/** Toggles between the two supported languages. */
export default function LanguageSwitcher({ className = "sh-btn sh-btn--ghost sh-btn--sm" }) {
  const { i18n, t } = useTranslation();
  const next = i18n.language === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      className={className}
      onClick={() => i18n.changeLanguage(next)}
      aria-label={t("nav.switchLanguage")}
      lang={next}
    >
      <Languages size={16} /> <span className="sh-lang__label">{LANGUAGES[next].label}</span>
    </button>
  );
}
