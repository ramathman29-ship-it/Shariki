import { Suspense } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, ClipboardCheck, FileSignature, BarChart3, LogOut, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/app/routes";
import useAuth from "@/hooks/useAuth";
import Brand from "@/components/ui/Brand";
import { PageLoader } from "@/components/ui/Skeleton";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationsMenu from "./NotificationsMenu";

const LINKS = [
  { to: ROUTES.admin.root, key: "overview", icon: LayoutDashboard, end: true },
  { to: ROUTES.admin.listings, key: "listings", icon: ClipboardCheck },
  { to: ROUTES.admin.contracts, key: "contracts", icon: FileSignature },
  { to: ROUTES.admin.reports, key: "reports", icon: BarChart3 },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate(ROUTES.login);
  };

  return (
    <div className="sh-admin">
      <aside className="sh-admin__side">
        <Brand to={ROUTES.admin.root} />
        <span className="sh-eyebrow" style={{ margin: "20px 0 8px" }}>{t("admin.title")}</span>
        <nav className="sh-admin__nav" aria-label={t("admin.title")}>
          {LINKS.map(({ to, key, icon: Icon, end }) => (
            <NavLink key={key} to={to} end={end}>
              <Icon size={18} /> {t(`admin.nav.${key}`)}
            </NavLink>
          ))}
        </nav>
        <div className="sh-admin__foot">
          <NavLink to={ROUTES.home}><ArrowLeft size={18} className="sh-flip" /> {t("admin.backToSite")}</NavLink>
          <button type="button" onClick={signOut}><LogOut size={18} className="sh-flip" /> {t("nav.signOut")}</button>
        </div>
      </aside>

      <div className="sh-admin__main">
        <header className="sh-admin__top">
          <span className="sh-text">{t("admin.greeting", { name: user?.name || "" })}</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <LanguageSwitcher />
            <NotificationsMenu />
          </div>
        </header>
        <main className="sh-admin__content">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
