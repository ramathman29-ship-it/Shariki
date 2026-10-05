import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Maximize, BedDouble, Bath, Building, Images, SearchX } from "lucide-react";
import { propertiesApi } from "@/api";
import { ROUTES, propertiesUrl } from "@/app/routes";
import { conditionOf, dealOf, feature, onImageError, photosOf } from "@/lib/property";
import useAsync from "@/hooks/useAsync";
import useAuth from "@/hooks/useAuth";
import usePropertyText from "@/hooks/usePropertyText";
import PropertyCard from "@/components/property/PropertyCard";
import PricePanel from "@/components/property/PricePanel";
import RequestModal from "@/components/property/RequestModal";
import EmptyState from "@/components/ui/EmptyState";
import Lightbox from "@/components/ui/Lightbox";

async function loadProperty(id) {
  const { property } = await propertiesApi.get(id);
  if (!property) return { property: null, similar: [] };
  const { properties } = await propertiesApi.list();
  const others = properties.filter((p) => p.id !== property.id);
  const sameCity = others.filter((p) => p.location === property.location);
  const sameDeal = others.filter((p) => p.location !== property.location && dealOf(p) === dealOf(property));
  return { property, similar: [...sameCity, ...sameDeal].slice(0, 3) };
}

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const text = usePropertyText();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { data, loading } = useAsync(() => loadProperty(id), [id], { property: null, similar: [] });
  const { property, similar } = data;

  const [lightbox, setLightbox] = useState(null);
  const [share, setShare] = useState(10);
  const [requesting, setRequesting] = useState(false);

  const photos = useMemo(() => photosOf(property), [property]);

  useEffect(() => {
    setLightbox(null);
    if (property) setShare(Math.min(10, property.available_percentage || 10));
  }, [property]);

  const openRequest = () => {
    if (!isLoggedIn) {
      navigate(ROUTES.login, { state: { from: location.pathname } });
      return;
    }
    setRequesting(true);
  };

  if (loading) {
    return (
      <div className="sh-container sh-details">
        <div className="sh-skeleton" style={{ height: 40, width: 360, marginBottom: 24 }} />
        <div className="sh-skeleton" style={{ height: 480, borderRadius: 24 }} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="sh-container sh-details">
        <EmptyState
          icon={SearchX}
          title={t("details.notFound.title")}
          text={t("details.notFound.text")}
          action={<Link to={ROUTES.properties} className="sh-btn sh-btn--primary">{t("details.notFound.back")}</Link>}
        />
      </div>
    );
  }

  const deal = dealOf(property);
  const condition = conditionOf(property);
  const shown = photos.slice(0, 3);
  const facts = [
    { icon: Maximize, label: t("details.facts.area"), value: property.area ? t("property.area", { value: property.area }) : "—" },
    { icon: BedDouble, label: t("details.facts.bedrooms"), value: feature(property, "Bedrooms") || "—" },
    { icon: Bath, label: t("details.facts.bathrooms"), value: feature(property, "Bathrooms") || "—" },
    { icon: Building, label: t("details.facts.type"), value: text.type(property.type) || "—" },
  ];
  const details = [
    [t("details.info.project"), property.project || "—"],
    [t("details.info.city"), text.city(property.location)],
    [t("details.info.condition"), text.condition(property)],
    [t("details.info.listing"), text.deal(property)],
    deal === "partial" && [t("details.info.availableShare"), `${property.available_percentage}%`],
    [t("details.info.reference"), `SH-${String(property.id).padStart(4, "0")}`],
  ].filter(Boolean);

  return (
    <div className="sh-container sh-details">
      <nav className="sh-crumbs" aria-label="Breadcrumb">
        <Link to={ROUTES.home}>{t("nav.home")}</Link> <span aria-hidden="true">/</span>
        <Link to={ROUTES.properties}>{t("nav.properties")}</Link> <span aria-hidden="true">/</span>
        <Link to={propertiesUrl({ city: property.location })}>{text.city(property.location)}</Link>
      </nav>

      <div className="sh-details__head">
        <div>
          <div className="sh-details__badges">
            <span className={`sh-badge sh-badge--${deal}`}>{text.deal(property)}</span>
            {property.type && <span className="sh-badge sh-badge--soft">{text.type(property.type)}</span>}
            <span className={`sh-badge sh-badge--${condition.tone}`}>{text.condition(property)}</span>
          </div>
          <h1 className="sh-h2" dir="auto">{property.project || property.address}</h1>
          <p className="sh-card__loc"><MapPin size={16} /> <bdi>{property.address}</bdi>{t("common.comma")}{text.city(property.location)}</p>
        </div>
      </div>

      {/* Gallery */}
      <div className={`sh-gallery sh-gallery--${shown.length}`}>
        {shown.map((src, i) => (
          <button key={src + i} type="button" className="sh-gallery__item" onClick={() => setLightbox(i)}
            aria-label={t("details.openPhoto", { n: i + 1 })}>
            <img src={src} alt="" onError={onImageError} />
            {i === shown.length - 1 && photos.length > 1 && (
              <span className="sh-gallery__more">
                <Images size={14} style={{ display: "inline", marginInlineEnd: 6, verticalAlign: -2 }} />
                {t("details.photos", { count: photos.length })}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="sh-details__grid">
        <div>
          <div className="sh-facts">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="sh-fact">
                <Icon size={20} />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          {property.description && (
            <div className="sh-block">
              <h2>{t("details.about")}</h2>
              <p dir="auto">{property.description}</p>
            </div>
          )}

          {property.suffixes.length > 0 && (
            <div className="sh-block">
              <h2>{t("details.features")}</h2>
              <div className="sh-features">
                {property.suffixes.map((s, i) => (
                  <div key={i}>
                    <span>{text.featureTitle(s.title)}</span>
                    <strong><bdi>{text.featureValue(s.description)}</bdi></strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="sh-block">
            <h2>{t("details.details")}</h2>
            <div className="sh-features">
              {details.map(([label, value]) => (
                <div key={label}><span>{label}</span><strong><bdi>{value}</bdi></strong></div>
              ))}
            </div>
          </div>
        </div>

        <PricePanel property={property} share={share} onShareChange={setShare} onRequest={openRequest} />
      </div>

      {similar.length > 0 && (
        <section style={{ marginTop: 72 }}>
          <div className="sh-section-head">
            <h2 className="sh-h2" style={{ fontSize: 30 }}>{t("details.similar")}</h2>
            <Link to={propertiesUrl({ city: property.location })} className="sh-link">
              {t("details.moreIn", { city: text.city(property.location) })}
            </Link>
          </div>
          <div className="sh-grid">
            {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}

      <Lightbox images={photos} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />
      {requesting && <RequestModal property={property} initialShare={share} onClose={() => setRequesting(false)} />}
    </div>
  );
}
