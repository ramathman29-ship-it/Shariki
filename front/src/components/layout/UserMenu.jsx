import { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CircleUser, LogOut, FileText, Building2, LayoutDashboard, UserRound } from "lucide-react";
import { ROUTES } from "@/app/routes";
import useAuth from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import useClickOutside from "@/hooks/useClickOutside";

export default function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const signOut = async () => {
    setOpen(false);
    await logout();
    toast.success(t("auth.signedOut"));
    navigate(ROUTES.home);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className="sh-icon-btn"
        aria-label={t("nav.account")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <CircleUser size={20} />
      </button>

      {open && (
        <div className="sh-menu" style={{ width: 260 }} onClick={close}>
          <div className="sh-menu__head">
            <strong>{user?.name || t("nav.account")}</strong>
            <span>{user?.email}</span>
          </div>
          {isAdmin && (
            <Link to={ROUTES.admin.root} className="sh-menu__item">
              <LayoutDashboard size={16} /> {t("nav.adminPanel")}
            </Link>
          )}
          <Link to={ROUTES.account.profile} className="sh-menu__item">
            <UserRound size={16} /> {t("nav.profile")}
          </Link>
          <Link to={ROUTES.account.requests} className="sh-menu__item">
            <FileText size={16} /> {t("nav.myRequests")}
          </Link>
          <Link to={ROUTES.account.properties} className="sh-menu__item">
            <Building2 size={16} /> {t("nav.myProperties")}
          </Link>
          <button type="button" className="sh-menu__item sh-menu__item--danger" onClick={signOut}>
            <LogOut size={16} className="sh-flip" /> {t("nav.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
