import { useState } from "react";
import { useTranslation } from "react-i18next";
import { authApi, fieldErrors } from "@/api";
import useAuth from "@/hooks/useAuth";
import PasswordInput from "@/components/ui/PasswordInput";

const COUNTRY_CODES = ["+963", "+966", "+971", "+961", "+962", "+90", "+20", "+49", "+44", "+1"];
const ACCOUNT_FIELDS = ["name", "email", "password", "password_confirmation"];

const EMPTY = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  personal_id: "",
  gender: "",
  birthday: "",
  mobile1: "",
  nationality: "",
  job: "",
  residency: "",
  budget: "0",
};

/** Two-step sign-up: account details, then the personal details required for legal registration. */
export default function RegisterForm({ onSuccess, onError }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [dial, setDial] = useState("+963");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const next = (e) => {
    e.preventDefault();
    const errs = {};
    if (form.password.length < 8) errs.password = t("auth.errors.passwordLength");
    if (form.password !== form.password_confirmation) errs.password_confirmation = t("auth.errors.passwordMatch");
    setErrors(errs);
    if (!Object.keys(errs).length) setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register({
        ...form,
        mobile1: `${dial}${form.mobile1.replace(/^0+/, "")}`,
        budget: form.budget || "0",
      });
      onSuccess(await login(form.email, form.password));
    } catch (err) {
      const errs = fieldErrors(err);
      setErrors(errs);
      if (ACCOUNT_FIELDS.some((k) => errs[k])) setStep(1);
      onError(Object.keys(errs).length ? { message: t("auth.errors.fixFields") } : err);
    } finally {
      setLoading(false);
    }
  };

  const field = (key, props = {}) => (
    <label className={`sh-field ${props.full ? "sh-field--full" : ""}`}>
      <span className="sh-label">{t(`auth.fields.${key}`)}</span>
      <input className={`sh-input ${errors[key] ? "is-invalid" : ""}`} value={form[key]} onChange={set(key)} required
        {...props} full={undefined} />
      {errors[key] && <span className="sh-error">{errors[key]}</span>}
    </label>
  );

  const password = (key, autoComplete) => (
    <label className="sh-field">
      <span className="sh-label">{t(`auth.fields.${key}`)}</span>
      <PasswordInput invalid={!!errors[key]} value={form[key]} onChange={set(key)} required minLength={8}
        autoComplete={autoComplete} placeholder={t(`auth.placeholders.${key}`)} />
      {errors[key] && <span className="sh-error">{errors[key]}</span>}
    </label>
  );

  return (
    <>
      <div className="sh-steps-mini" aria-hidden="true">
        <span className="is-done" />
        <span className={step === 2 ? "is-done" : ""} />
      </div>
      <p className="sh-label" style={{ margin: "0 0 16px", color: "var(--sh-muted)" }}>
        {t("auth.step", { step, total: 2 })} · {t(step === 1 ? "auth.stepAccount" : "auth.stepPersonal")}
      </p>

      {step === 1 ? (
        <form onSubmit={next}>
          {field("name", { maxLength: 20, autoComplete: "name" })}
          {field("email", { type: "email", autoComplete: "email", placeholder: t("auth.emailPlaceholder") })}
          {password("password", "new-password")}
          {password("password_confirmation", "new-password")}
          <button className="sh-btn sh-btn--primary sh-btn--block" style={{ height: 48, marginTop: 6 }}>
            {t("common.continue")}
          </button>
        </form>
      ) : (
        <form onSubmit={submit}>
          <div className="sh-form-grid">
            {field("personal_id", { inputMode: "numeric", pattern: "[0-9]*" })}
            <label className="sh-field">
              <span className="sh-label">{t("auth.fields.gender")}</span>
              <select className={`sh-select ${errors.gender ? "is-invalid" : ""}`} value={form.gender} onChange={set("gender")} required>
                <option value="" hidden>{t("common.select")}</option>
                <option value="male">{t("auth.male")}</option>
                <option value="female">{t("auth.female")}</option>
              </select>
            </label>
            <label className="sh-field sh-field--full">
              <span className="sh-label">{t("auth.fields.mobile1")}</span>
              <div className="sh-phone" dir="ltr">
                <select className="sh-select" value={dial} onChange={(e) => setDial(e.target.value)} aria-label={t("auth.countryCode")}>
                  {COUNTRY_CODES.map((code) => <option key={code} value={code}>{code}</option>)}
                </select>
                <input className={`sh-input ${errors.mobile1 ? "is-invalid" : ""}`} type="tel" placeholder="9XX XXX XXX"
                  value={form.mobile1} onChange={set("mobile1")} required />
              </div>
              {errors.mobile1 && <span className="sh-error">{errors.mobile1}</span>}
            </label>
            {field("birthday", { type: "date" })}
            {field("nationality", { maxLength: 20 })}
            {field("job", { maxLength: 50 })}
            {field("residency", { maxLength: 20 })}
            {field("budget", { type: "number", min: 0, required: false, full: true })}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="button" className="sh-btn sh-btn--ghost" style={{ height: 48 }} onClick={() => setStep(1)}>
              {t("common.back")}
            </button>
            <button className="sh-btn sh-btn--primary" style={{ height: 48, flex: 1 }} disabled={loading}>
              {loading ? t("auth.creating") : t("auth.createAccount")}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
