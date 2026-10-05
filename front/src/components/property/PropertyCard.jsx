import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import { ROUTES } from "@/app/routes";
import { dealOf, feature, onImageError, ownedPercent, photosOf } from "@/lib/property";
import usePropertyText from "@/hooks/usePropertyText";
import Price from "./Price";
import ShareProgress from "./ShareProgress";

/**
 * Listing card. Renders a link by default; pass `as="article"` plus `footer`
 * for the static variant used on account pages.
 */
export default function PropertyCard({ property, badges, footer, as = "link", children }) {
  const { t } = useTranslation();
  const text = usePropertyText();
  const deal = dealOf(property);
  const beds = feature(property, "Bedrooms");
  const baths = feature(property, "Bathrooms");
  const owned = ownedPercent(property);

  const body = (
    <>
      <div className="sh-card__media">
        <img
          src={photosOf(property)[0]}
          alt={property.project || property.address}
          loading="lazy"
          onError={onImageError}
        />
        <div className="sh-card__tags">
          {badges || (
            <>
              <span className={`sh-badge sh-badge--${deal}`}>{text.deal(property)}</span>
              {property.type && <span className="sh-badge">{text.type(property.type)}</span>}
            </>
          )}
        </div>
      </div>

      <div className="sh-card__body">
        <Price property={property} />
        <h3 className="sh-card__title" dir="auto">{property.project || property.address}</h3>
        <p className="sh-card__loc">
          <MapPin size={14} /> <span><bdi>{property.address}</bdi>{t("common.comma")}{text.city(property.location)}</span>
        </p>

        {children ??
          (deal === "partial" ? (
            <ShareProgress
              style={{ paddingTop: 16 }}
              percent={owned}
              start={t("property.available", { value: property.available_percentage })}
              end={t("property.owned", { value: owned })}
            />
          ) : (
            <div className="sh-card__specs">
              {beds && (
                <span>
                  <BedDouble size={16} /> {t("property.beds", { count: Number(beds) })}
                </span>
              )}
              {baths && (
                <span>
                  <Bath size={16} /> {t("property.baths", { count: Number(baths) })}
                </span>
              )}
              {property.area && (
                <span>
                  <Maximize size={15} /> {t("property.area", { value: property.area })}
                </span>
              )}
            </div>
          ))}
      </div>
      {footer && <div className="sh-owned__foot">{footer}</div>}
    </>
  );

  return as === "link" ? (
    <Link to={ROUTES.property(property.id)} className="sh-card">
      {body}
    </Link>
  ) : (
    <article className="sh-card sh-card--static">{body}</article>
  );
}
