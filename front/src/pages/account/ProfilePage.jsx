import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Mail, Phone, IdCard, CalendarDays, Flag, Briefcase, MapPin, Wallet, UserRound, FileText, Building2, LogOut, ShieldCheck,
} from "lucide-react";
import { ROUTES } from "@/app/routes";
import { formatMoney } from "@/lib/format";
import useAuth from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import PageHeader from "@/components/ui/PageHeader";
import { PageLoader } from "@/components/ui/Skeleton";

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAdmin, loading, logout } = useAuth();

  if (loading || !user) return <PageLoader />;

  const birthday = user.birthday
    ? new Date(user.birthday).toLocaleDateString(i18n.language === "ar" ? "ar-SY-u-nu-latn" : "en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const fields = [
    { icon: Mail, label: t("auth.fields.email"), value: user.email, ltr: true },
    { icon: Phone, label: t("auth.fields.mobile1"), value: user.mobile, ltr: true },
    { icon: IdCard, label: t("auth.fields.personal_id"), value: user.personal_id, ltr: true },
    { icon: UserRound, label: t("auth.fields.gender"), value: user.gender && t(`auth.${user.gender}`, { defaultValue: user.gender }) },
    { icon: CalendarDays, label: t("auth.fields.birthday"), value: birthday },
    { icon: Flag, label: t("auth.fields.nationality"), value: user.nationality },
    { icon: Briefcase, label: t("auth.fields.job"), value: user.job },
    { icon: MapPin, label: t("auth.fields.residency"), value: user.residency && t(`data.cities.${user.residency}`, { defaultValue: user.residency }) },
    { icon: Wallet, label: t("profile.budget"), value: Number(user.budget) > 0 ? formatMoney(user.budget) : null },
  ];
  const missing = fields.filter((f) => !f.value).length;

  const signOut = async () => {
    await logout();
    toast.success(t("auth.signedOut"));
    navigate(ROUTES.home);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: t("nav.home"), to: ROUTES.home }, { label: t("nav.profile") }]}
        title={t("nav.profile")}
        lead={t("profile.lead")}
      />

      <div className="sh-container sh-account">
        <div className="sh-profile">
          {/* ===== Identity card ===== */}
          <aside className="sh-profile__card">
            <div className="sh-avatar" aria-hidden="true">{initials(user.name)}</div>
            <h2>{user.name}</h2>
            <p dir="ltr">{user.email}</p>
            <div className="sh-profile__badges">
              <span className="sh-badge sh-badge--soft">{isAdmin ? t("profile.roleAdmin") : t("profile.roleMember")}</span>
              {missing === 0 && (
                <span className="sh-badge sh-badge--good"><ShieldCheck size={13} /> {t("profile.complete")}</span>
              )}
            </div>

            <nav className="sh-profile__links">
              {isAdmin && (
                <Link to={ROUTES.admin.root} className="sh-menu__item"><ShieldCheck size={16} /> {t("nav.adminPanel")}</Link>
              )}
              <Link to={ROUTES.account.requests} className="sh-menu__item"><FileText size={16} /> {t("nav.myRequests")}</Link>
              <Link to={ROUTES.account.properties} className="sh-menu__item"><Building2 size={16} /> {t("nav.myProperties")}</Link>
              <button type="button" className="sh-menu__item sh-menu__item--danger" onClick={signOut}>
                <LogOut size={16} className="sh-flip" /> {t("nav.signOut")}
              </button>
            </nav>
          </aside>

          {/* ===== Details ===== */}
          <section className="sh-form-card">
            <div className="sh-profile__head">
              <div>
                <h3>{t("profile.personalInfo")}</h3>
                <p>{t("profile.personalInfoText")}</p>
              </div>
              {missing > 0 && <span className="sh-badge sh-badge--ok">{t("profile.missing", { count: missing })}</span>}
            </div>

            <dl className="sh-info-grid">
              {fields.map(({ icon: Icon, label, value, ltr }) => (
                <div key={label} className="sh-info">
                  <span className="sh-info__icon"><Icon size={18} /></span>
                  <div>
                    <dt>{label}</dt>
                    <dd className={value ? "" : "is-empty"} dir={value && ltr ? "ltr" : undefined}>
                      {value || t("profile.notProvided")}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <p className="sh-panel__note" style={{ marginTop: 24 }}>
              <ShieldCheck size={16} /> {t("profile.privacyNote")}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
