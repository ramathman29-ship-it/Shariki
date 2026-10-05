import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, KeyRound, PieChart, Building, ArrowRight } from "lucide-react";
import { propertiesApi } from "@/api";
import { ROUTES, propertiesUrl } from "@/app/routes";
import { dealOf, photosOf } from "@/lib/property";
import useAsync from "@/hooks/useAsync";
import usePropertyText from "@/hooks/usePropertyText";
import PropertyCard from "@/components/property/PropertyCard";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import Select from "@/components/ui/Select";

const HERO_IMAGE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&auto=format&fit=crop&q=75";
const CTA_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&auto=format&fit=crop&q=70";

const DEALS = [
  { value: "sale", icon: Building },
  { value: "partial", icon: PieChart },
  { value: "rent", icon: KeyRound },
];

export default function HomePage() {
  const { t } = useTranslation();
  const text = usePropertyText();
  const navigate = useNavigate();
  const [search, setSearch] = useState({ deal: "sale", q: "", city: "", type: "" });
  const { data, loading } = useAsync(propertiesApi.list, [], { properties: [] });
  const properties = data.properties;

  const cities = useMemo(() => {
    const map = {};
    properties.forEach((p) => {
      if (!p.location) return;
      map[p.location] ??= { name: p.location, count: 0, img: photosOf(p)[0] };
      map[p.location].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [properties]);

  const types = useMemo(() => [...new Set(properties.map((p) => p.type).filter(Boolean))].sort(), [properties]);

  // six featured listings, alternating deal types
  const featured = useMemo(() => {
    const byDeal = { sale: [], partial: [], rent: [] };
    properties.forEach((p) => byDeal[dealOf(p)].push(p));
    const mixed = [];
    for (let i = 0; mixed.length < 6 && i < properties.length; i++) {
      for (const d of ["sale", "partial", "rent"]) if (byDeal[d][i] && mixed.length < 6) mixed.push(byDeal[d][i]);
    }
    return mixed;
  }, [properties]);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(propertiesUrl(search));
  };



  return (
    <>
      {/* ===== Hero ===== */}
      <section className="sh-hero">
        <div className="sh-hero__bg" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="sh-container">
          <span className="sh-eyebrow">{t("home.eyebrow")}</span>
          <h1 className="sh-h1">{t("home.title")}</h1>
          <p className="sh-lead">{t("home.lead")}</p>

          <form className="sh-search" onSubmit={submitSearch} role="search">
            <div className="sh-search__tabs">
              {DEALS.map(({ value }) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={search.deal === value}
                  className={search.deal === value ? "is-active" : ""}
                  onClick={() => setSearch({ ...search, deal: value })}
                >
                  {t(`home.searchTabs.${value}`)}
                </button>
              ))}
            </div>
            <div className="sh-search__row">
              <label className="sh-field">
                <span className="sh-label">{t("common.search")}</span>
                <input className="sh-input" placeholder={t("home.searchPlaceholder")} value={search.q} onChange={(e) => setSearch({ ...search, q: e.target.value })} />
              </label>
              <div className="sh-field">
                <span className="sh-label">{t("filters.city")}</span>
                <Select
                  label={t("filters.city")}
                  value={search.city}
                  onChange={(city) => setSearch({ ...search, city })}
                  options={[{ value: "", label: t("filters.allCities") }, ...cities.map((c) => ({ value: c.name, label: text.city(c.name) }))]}
                />
              </div>
              <div className="sh-field">
                <span className="sh-label">{t("filters.type")}</span>
                <Select
                  label={t("filters.type")}
                  value={search.type}
                  onChange={(type) => setSearch({ ...search, type })}
                  options={[{ value: "", label: t("filters.anyType") }, ...types.map((v) => ({ value: v, label: text.type(v) }))]}
                />
              </div>
              <button type="submit" className="sh-btn sh-btn--accent">
                <Search size={18} /> {t("common.search")}
              </button>
            </div>
          </form>

          <div className="sh-hero__stats">
            <div><strong>{properties.length || "—"}</strong><span>{t("home.stats.listings")}</span></div>
            <div><strong>{cities.length || "—"}</strong><span>{t("home.stats.cities")}</span></div>
            <div><strong>1%</strong><span>{t("home.stats.minShare")}</span></div>
          </div>
        </div>
      </section>

      {/* ===== Featured ===== */}
      <section className="sh-section">
        <div className="sh-container">
          <div className="sh-section-head">
            <div>
              <span className="sh-eyebrow">{t("home.featured.eyebrow")}</span>
              <h2 className="sh-h2">{t("home.featured.title")}</h2>
            </div>
            <Link to={ROUTES.properties} className="sh-link">
              {t("home.featured.viewAll")} <ArrowRight size={16} className="sh-flip" />
            </Link>
          </div>
          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="sh-grid">
              {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ===== Three ways ===== */}
      <section className="sh-section sh-section--alt">
        <div className="sh-container">
          <div className="sh-section-head sh-section-head--center">
            <span className="sh-eyebrow">{t("home.ways.eyebrow")}</span>
            <h2 className="sh-h2">{t("home.ways.title")}</h2>
          </div>
          <div className="sh-deals">
            {DEALS.map(({ value, icon: Icon }) => (
              <Link key={value} to={propertiesUrl({ deal: value })} className="sh-deal">
                <span className="sh-deal__icon"><Icon size={24} /></span>
                <h3>{t(`home.ways.${value}.title`)}</h3>
                <p>{t(`home.ways.${value}.text`)}</p>
                <span className="sh-link">
                  {t(`home.ways.${value}.cta`)} <ArrowRight size={16} className="sh-flip" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Cities ===== */}
      {cities.length > 0 && (
        <section className="sh-section">
          <div className="sh-container">
            <div className="sh-section-head">
              <div>
                <span className="sh-eyebrow">{t("home.cities.eyebrow")}</span>
                <h2 className="sh-h2">{t("home.cities.title")}</h2>
              </div>
            </div>
            <div className="sh-cities">
              {cities.slice(0, 6).map((c) => (
                <Link key={c.name} to={propertiesUrl({ city: c.name })} className="sh-city">
                  <img src={c.img} alt={text.city(c.name)} loading="lazy" />
                  <div className="sh-city__label">
                    <strong>{text.city(c.name)}</strong>
                    <span>{t("common.propertiesCount", { count: c.count })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== How co-ownership works ===== */}
      <section className="sh-section sh-section--alt">
        <div className="sh-container">
          <div className="sh-section-head">
            <div>
              <span className="sh-eyebrow">{t("home.steps.eyebrow")}</span>
              <h2 className="sh-h2">{t("home.steps.title")}</h2>
            </div>
            <Link to={`${ROUTES.about}#how`} className="sh-link">
              {t("common.learnMore")} <ArrowRight size={16} className="sh-flip" />
            </Link>
          </div>
          <div className="sh-steps">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="sh-step">
                <div className="sh-step__num">{n}</div>
                <h4>{t(`home.steps.${n}.title`)}</h4>
                <p>{t(`home.steps.${n}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="sh-section">
        <div className="sh-container">
          <div className="sh-cta">
            <div>
              <span className="sh-eyebrow" style={{ color: "#f3d7bf" }}>{t("home.cta.eyebrow")}</span>
              <h2 className="sh-h2">{t("home.cta.title")}</h2>
              <p className="sh-lead">{t("home.cta.text")}</p>
              <div className="sh-cta__actions">
                <Link to={ROUTES.listProperty} className="sh-btn sh-btn--light">{t("nav.listProperty")}</Link>
                <Link to={`${ROUTES.about}#fees`} className="sh-btn sh-btn--ghost">{t("home.cta.fees")}</Link>
              </div>
            </div>
            <div className="sh-cta__img">
              <img src={CTA_IMAGE} alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
