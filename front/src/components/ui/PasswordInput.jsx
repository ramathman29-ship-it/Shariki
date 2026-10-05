import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ invalid, className = "", ...props }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="sh-pass">
      <input
        className={`sh-input ${invalid ? "is-invalid" : ""} ${className}`}
        type={visible ? "text" : "password"}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
