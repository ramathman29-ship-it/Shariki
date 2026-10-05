import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import PasswordInput from "@/components/ui/PasswordInput";

// Demo account from DemoDataSeeder, only shown in dev when set in .env
const DEMO = { email: import.meta.env.VITE_DEMO_EMAIL || "", password: import.meta.env.VITE_DEMO_PASSWORD || "" };

/** @param {{ onSuccess: (profile) => void, onError: (err) => void }} props */
export default function LoginForm({ onSuccess, onError }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      onSuccess(await login(form.email, form.password));
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={submit}>
        <label className="sh-field">
          <span className="sh-label">{t("auth.email")}</span>
          <input className="sh-input" type="email" autoComplete="email" placeholder={t("auth.emailPlaceholder")} required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="sh-field">
          <span className="sh-label">{t("auth.password")}</span>
          <PasswordInput autoComplete="current-password" placeholder={t("auth.passwordPlaceholder")} required minLength={8}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="sh-btn sh-btn--primary sh-btn--block" disabled={loading} style={{ height: 48, marginTop: 6 }}>
          {loading ? t("auth.signingIn") : t("nav.signIn")}
        </button>
      </form>

      {import.meta.env.DEV && DEMO.email && DEMO.password && (
        <div className="sh-demo">
          <div>
            <strong>{t("auth.demo")}</strong>
            <span dir="ltr">{DEMO.email} · {DEMO.password}</span>
          </div>
          <button type="button" className="sh-btn sh-btn--ghost sh-btn--sm" onClick={() => setForm(DEMO)}>
            {t("auth.useDemo")}
          </button>
        </div>
      )}
    </>
  );
}
