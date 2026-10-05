import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { ROUTES } from "@/app/routes";
import { errorMessage } from "@/lib/errors";
import useAuth from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import Brand from "@/components/ui/Brand";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const VISUAL = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&auto=format&fit=crop&q=75";

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isLoggedIn } = useAuth();
  const [mode, setMode] = useState("signin");
  const [error, setError] = useState("");
  const redirectTo = location.state?.from || ROUTES.home;

  if (isLoggedIn && !error) return <Navigate to={redirectTo} replace />;

  const switchMode = (m) => {
    setMode(m);
    setError("");
  };

  const onSuccess = (profile) => {
    toast.success(t(mode === "signin" ? "auth.welcomeBack" : "auth.accountCreated"));
    navigate(profile?.is_admin && !location.state?.from ? ROUTES.admin.root : redirectTo, { replace: true });
  };

  const onError = (err) =>
    setError(err?.message === "Invalid email or password" ? t("auth.errors.invalid") : errorMessage(err, t));

  return (
    <div className="sh-auth">
      <aside className="sh-auth__visual" style={{ backgroundImage: `url(${VISUAL})` }}>
        <Brand />
        <div>
          <h2 className="sh-h2">{t("home.title")}</h2>
          <p>{t("auth.visualText")}</p>
          <div className="sh-auth__points">
            <div><strong>1%</strong><span>{t("home.stats.minShare")}</span></div>
            <div><strong>6</strong><span>{t("home.stats.cities")}</span></div>
            <div><strong>2%</strong><span>{t("auth.flatCommission")}</span></div>
          </div>
        </div>
      </aside>

      <main className="sh-auth__main">
        <div className="sh-auth__top">
          <Brand />
          <div style={{ display: "flex", gap: 8 }}>
            <LanguageSwitcher />
            <Link to={ROUTES.home} className="sh-btn sh-btn--ghost sh-btn--sm">
              <ArrowLeft size={16} className="sh-flip" /> {t("auth.backToSite")}
            </Link>
          </div>
        </div>

        <div className="sh-auth__box">
          <h1 className="sh-h2">{t(mode === "signin" ? "auth.signinTitle" : "auth.signupTitle")}</h1>
          <p className="sh-text">{t(mode === "signin" ? "auth.signinLead" : "auth.signupLead")}</p>

          <div className="sh-auth__switch" role="tablist">
            <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "is-active" : ""}
              onClick={() => switchMode("signin")}>
              {t("nav.signIn")}
            </button>
            <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "is-active" : ""}
              onClick={() => switchMode("signup")}>
              {t("auth.createAccount")}
            </button>
          </div>

          {error && (
            <div className="sh-alert" role="alert" style={{ marginBottom: 16 }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {mode === "signin" ? (
            <LoginForm onSuccess={onSuccess} onError={onError} />
          ) : (
            <RegisterForm onSuccess={onSuccess} onError={onError} />
          )}
        </div>

        <p className="sh-auth__foot">{t("auth.terms")}</p>
      </main>
    </div>
  );
}
