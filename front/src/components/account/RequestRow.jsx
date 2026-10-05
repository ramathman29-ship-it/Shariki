import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarDays, PieChart, UserRound } from "lucide-react";
import { ROUTES } from "@/app/routes";
import { FALLBACK_IMAGE, dealOf, onImageError } from "@/lib/property";
import usePropertyText from "@/hooks/usePropertyText";

const STATUS_TONE = { pending: "ok", accepted: "good", rejected: "bad", done: "good", investment: "good" };

/** One request (sent or received) with its property summary and an actions slot. */
export default function RequestRow({ request, actions, showRequester }) {
  const { t } = useTranslation();
  const text = usePropertyText();
  const info = request.property_info;
  const deal = info ? dealOf(info) : null;
  const propertyId = info?.id ?? request.property_id;
  const href = ROUTES.property(propertyId);

  return (
    <article className="sh-req">
      <Link to={href} className="sh-req__img">
        <img src={info?.photo || FALLBACK_IMAGE} alt="" onError={onImageError} />
      </Link>

      <div>
        <div className="sh-req__top">
          <span className={`sh-badge sh-badge--${STATUS_TONE[request.status] || "soft"}`}>
            {t(`requests.status.${request.status}`, { defaultValue: request.status })}
          </span>
          {deal && <span className={`sh-badge sh-badge--${deal}`}>{t(`deal.short.${deal}`)}</span>}
        </div>
        <h3>
          <Link to={href}>{info ? info.project || info.address : t("requests.propertyNumber", { id: propertyId })}</Link>
        </h3>
        {info && <p className="sh-text" style={{ fontSize: 14 }}><bdi>{info.address}</bdi>{t("common.comma")}{text.city(info.location)}</p>}
        {request.description && <p className="sh-req__msg" dir="auto">{request.description}</p>}
        <div className="sh-req__meta">
          {showRequester && request.user?.name && <span><UserRound size={14} /> {request.user.name}</span>}
          {deal === "partial" && <span><PieChart size={14} /> {t("requests.share", { value: request.rate })}</span>}
          <span><CalendarDays size={14} /> {request.submitted_at || "—"}</span>
        </div>
      </div>

      {actions ? <div className="sh-req__actions">{actions}</div> : <div />}
    </article>
  );
}
