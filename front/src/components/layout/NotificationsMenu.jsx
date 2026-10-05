import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import useNotifications from "@/hooks/useNotifications";
import useClickOutside from "@/hooks/useClickOutside";
import { notificationTarget } from "@/lib/notifications";

export default function NotificationsMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, unread, markOneRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const openNotification = (n) => {
    setOpen(false);
    markOneRead();
    navigate(notificationTarget(n));
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className="sh-icon-btn"
        aria-label={t("nav.notifications")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Bell size={19} />
        {unread > 0 && <span className="sh-dot">{unread}</span>}
      </button>

      {open && (
        <div className="sh-menu">
          <div className="sh-menu__head">
            <strong>{t("nav.notifications")}</strong>
            <span>{t("nav.unread", { count: unread })}</span>
          </div>
          {items.length === 0 ? (
            <p className="sh-menu__empty">{t("nav.noNotifications")}</p>
          ) : (
            items.map((n, i) => (
              <button key={n.id || i} type="button" className="sh-menu__item" onClick={() => openNotification(n)}>
                <Bell size={16} style={{ flexShrink: 0 }} />
                <span>
                  {n.message}
                  <small>{n.created_at}</small>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
