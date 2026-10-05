import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/** Full-screen image viewer. `index` null = closed. */
export default function Lightbox({ images, index, onChange, onClose }) {
  const { t, i18n } = useTranslation();
  const open = index !== null && index !== undefined;
  const count = images.length;
  const rtl = i18n.dir() === "rtl";

  useEffect(() => {
    if (!open) return;
    const next = () => onChange((index + 1) % count);
    const prev = () => onChange((index - 1 + count) % count);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") (rtl ? prev : next)();
      if (e.key === "ArrowLeft") (rtl ? next : prev)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, count, rtl, onChange, onClose]);

  if (!open) return null;

  const go = (step) => (e) => {
    e.stopPropagation();
    onChange((index + step + count) % count);
  };

  return (
    <div className="sh-lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()} />
      <button className="sh-icon-btn sh-lightbox__close" aria-label={t("common.close")} onClick={onClose}>
        <X size={20} />
      </button>
      {count > 1 && (
        <>
          <button className="sh-icon-btn sh-lightbox__prev" aria-label={t("common.previous")} onClick={go(-1)}>
            <ChevronLeft size={20} className="sh-flip" />
          </button>
          <button className="sh-icon-btn sh-lightbox__next" aria-label={t("common.next")} onClick={go(1)}>
            <ChevronRight size={20} className="sh-flip" />
          </button>
          <span className="sh-lightbox__count">
            {index + 1} / {count}
          </span>
        </>
      )}
    </div>
  );
}
