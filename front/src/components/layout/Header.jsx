import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Plus } from "lucide-react";
import { ROUTES } from "@/app/routes";
import useAuth from "@/hooks/useAuth";
import Brand from "@/components/ui/Brand";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationsMenu from "./NotificationsMenu";
import UserMenu from "./UserMenu";

export default function Header() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // close the mobile menu on navigation
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sh-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="sh-container sh-nav__inner">
        <Brand />

        <nav className={`sh-nav__links ${menuOpen ? "is-open" : ""}`} aria-label={t("nav.main")}>
          <NavLink to={ROUTES.home} end>{t("nav.home")}</NavLink>
          <NavLink to={ROUTES.properties}>{t("nav.properties")}</NavLink>
          <NavLink to={ROUTES.about}>{t("nav.about")}</NavLink>
          {isLoggedIn && <NavLink to={ROUTES.account.requests}>{t("nav.myRequests")}</NavLink>}
          {isLoggedIn && <NavLink to={ROUTES.account.properties}>{t("nav.myProperties")}</NavLink>}
        </nav>

        <div className="sh-nav__actions">
          <LanguageSwitcher />
          <Link to={ROUTES.listProperty} className="sh-btn sh-btn--primary sh-btn--sm sh-nav__cta">
            <Plus size={16} /> {t("nav.listProperty")}
          </Link>

          {isLoggedIn ? (
            <>
              <NotificationsMenu />
              <UserMenu />
            </>
          ) : (
            <Link to={ROUTES.login} className="sh-btn sh-btn--ghost sh-btn--sm">
              {t("nav.signIn")}
            </Link>
          )}

          <button
            type="button"
            className="sh-icon-btn sh-nav__burger"
            aria-label={t("nav.menu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
