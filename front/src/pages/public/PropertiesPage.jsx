import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, X, SearchX, Info, ArrowUpDown } from "lucide-react";
import { propertiesApi } from "@/api";
import { ROUTES } from "@/app/routes";
import { CONDITIONS, dealOf, feature } from "@/lib/property";
import { formatNumber } from "@/lib/format";
import useAsync from "@/hooks/useAsync";
import usePropertyText from "@/hooks/usePropertyText";
import PropertyCard from "@/components/property/PropertyCard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";
import { SkeletonGrid } from "@/components/ui/Skeleton";

const DEAL_TABS = ["", "sale", "partial", "rent"];
const BEDS = ["1", "2", "3", "4"];

const SORTS = {
  newest: (a, b) => b.id - a.id,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "area-desc": (a, b) => b.area - a.area,
};

// Filters live in the URL so results can be linked and shared
const KEYS = ["q", "deal", "city", "type", "min", "max", "area", "beds", "cond", "sort"];

function matches(p, f) {
  if (f.deal && dealOf(p) !== f.deal) return false;
  if (f.city && p.location !== f.city) return false;
  if (f.type && p.type !== f.type) return false;
  if (f.cond && p.condition !== f.cond) return false;
  if (f.min && Number(p.price) < Number(f.min)) return false;
  if (f.max && Number(p.price) > Number(f.max)) return false;
  if (f.area && Number(p.area) < Number(f.area)) return false;
  if (f.beds && Number(feature(p, "Bedrooms") || 0) < Number(f.beds)) return false;
  const q = f.q.trim().toLowerCase();
  if (q && ![p.address, p.location, p.project, p.type, p.description].join(" ").toLowerCase().includes(q)) return false;
  return true;
}

export default function PropertiesPage() {
  const { t } = useTranslation();
  const text = usePropertyText();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data, loading } = useAsync(propertiesApi.list, [], { properties: [], demo: false });
  const { properties, demo } = data;

  const f = useMemo(() => Object.fromEntries(KEYS.map((k) => [k, params.get(k) || ""])), [params]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const clearAll = () => setParams(f.sort ? { sort: f.sort } : {}, { replace: true });

  const cities = useMemo(() => [...new Set(properties.map((p) => p.location).filter(Boolean))].sort(), [properties]);
  const types = useMemo(() => [...new Set(properties.map((p) => p.type).filter(Boolean))].sort(), [properties]);

  const results = useMemo(
    () => properties.filter((p) => matches(p, f)).sort(SORTS[f.sort] || SORTS.newest),
    [properties, f]
  );

  const chips = [
    f.q && { key: "q", label: `“${f.q}”` },
    f.deal && { key: "deal", label: t(`deal.${f.deal}`) },
    f.city && { key: "city", label: text.city(f.city) },
    f.type && { key: "type", label: text.type(f.type) },
    f.min && { key: "min", label: t("filters.chipMin", { value: formatNumber(f.min) }) },
    f.max && { key: "max", label: t("filters.chipMax", { value: formatNumber(f.max) }) },
    f.area && { key: "area", label: t("filters.chipArea", { value: f.area }) },
    f.beds && { key: "beds", label: t("filters.chipBeds", { value: f.beds }) },
    f.cond && { key: "cond", label: t(`condition.${CONDITIONS[f.cond]?.key}`) },
  ].filter(Boolean);

  const title = t(`properties.title.${f.deal || "all"}`) + (f.city ? ` ${t("properties.inCity", { city: text.city(f.city) })}` : "");

  return (
    <>
      <PageHeader
        crumbs={[{ label: t("nav.home"), to: ROUTES.home }, { label: t("nav.properties") }]}
        title={title}
        lead={t("properties.lead")}
      />

      <div className="sh-container">
        <div className="sh-listing">
          {/* ===== Filters ===== */}
          {filtersOpen && <div className="sh-backdrop" onClick={() => setFiltersOpen(false)} />}
          <aside className={`sh-filters ${filtersOpen ? "is-open" : ""}`} aria-label={t("filters.title")}>
            <div className="sh-filters__head">
              <h3>{t("filters.title")}</h3>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {chips.length > 0 && (
                  <button type="button" className="sh-text-btn" onClick={clearAll}>{t("filters.clearAll")}</button>
                )}
                <button
                  type="button"
                  className="sh-icon-btn sh-filters__close"
                  onClick={() => setFiltersOpen(false)}
                  aria-label={t("common.close")}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <label className="sh-field">
              <span className="sh-label">{t("filters.keyword")}</span>
              <div className="sh-searchbox">
                <Search size={16} />
                <input
                  className="sh-input"
                  placeholder={t("filters.keywordPlaceholder")}
                  value={f.q}
                  onChange={(e) => setFilter("q", e.target.value)}
                />
              </div>
            </label>

            <div className="sh-field">
              <span className="sh-label">{t("filters.city")}</span>
              <Select
                label={t("filters.city")}
                value={f.city}
                onChange={(v) => setFilter("city", v)}
                options={[{ value: "", label: t("filters.allCities") }, ...cities.map((c) => ({ value: c, label: text.city(c) }))]}
              />
            </div>

            <div className="sh-field">
              <span className="sh-label">{t("filters.type")}</span>
              <Select
                label={t("filters.type")}
                value={f.type}
                onChange={(v) => setFilter("type", v)}
                options={[{ value: "", label: t("filters.anyType") }, ...types.map((v) => ({ value: v, label: text.type(v) }))]}
              />
            </div>

            <div className="sh-field">
              <span className="sh-label">{f.deal === "rent" ? t("filters.priceMonthly") : t("filters.price")}</span>
              <div className="sh-range">
                <input className="sh-input" type="number" min="0" placeholder={t("filters.min")} aria-label={t("filters.min")}
                  value={f.min} onChange={(e) => setFilter("min", e.target.value)} />
                <input className="sh-input" type="number" min="0" placeholder={t("filters.max")} aria-label={t("filters.max")}
                  value={f.max} onChange={(e) => setFilter("max", e.target.value)} />
              </div>
            </div>

            <div className="sh-field">
              <span className="sh-label">{t("filters.bedrooms")}</span>
              <div className="sh-pills sh-pills--even">
                <button type="button" className={`sh-pill ${!f.beds ? "is-active" : ""}`} onClick={() => setFilter("beds", "")}>
                  {t("filters.any")}
                </button>
                {BEDS.map((b) => (
                  <button key={b} type="button" className={`sh-pill ${f.beds === b ? "is-active" : ""}`} onClick={() => setFilter("beds", b)}>
                    {b}+
                  </button>
                ))}
              </div>
            </div>

            <label className="sh-field">
              <span className="sh-label">{t("filters.minArea")}</span>
              <input className="sh-input" type="number" min="0" placeholder={t("filters.minAreaPlaceholder")}
                value={f.area} onChange={(e) => setFilter("area", e.target.value)} />
            </label>

            <div className="sh-field">
              <span className="sh-label">{t("filters.condition")}</span>
              <div className="sh-pills">
                <button type="button" className={`sh-pill ${!f.cond ? "is-active" : ""}`} onClick={() => setFilter("cond", "")}>
                  {t("filters.any")}
                </button>
                {Object.entries(CONDITIONS).map(([code, c]) => (
                  <button key={code} type="button" className={`sh-pill ${f.cond === code ? "is-active" : ""}`} onClick={() => setFilter("cond", code)}>
                    {t(`condition.${c.key}`)}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="sh-btn sh-btn--primary sh-btn--block sh-filters__close" onClick={() => setFiltersOpen(false)}>
              {t("filters.showResults", { count: results.length })}
            </button>
          </aside>

          {/* ===== Results ===== */}
          <div>
            <div className="sh-toolbar">
              <div className="sh-segment" role="tablist">
                {DEAL_TABS.map((d) => (
                  <button key={d || "all"} type="button" role="tab" aria-selected={f.deal === d}
                    className={f.deal === d ? "is-active" : ""} onClick={() => setFilter("deal", d)}>
                    {d ? t(`deal.short.${d}`) : t("filters.all")}
                  </button>
                ))}
              </div>
              <div className="sh-toolbar__right">
                <button type="button" className="sh-btn sh-btn--ghost sh-btn--sm sh-filter-toggle" onClick={() => setFiltersOpen(true)}>
                  <SlidersHorizontal size={16} /> {t("filters.title")}{chips.length > 0 && ` (${chips.length})`}
                </button>
                <Select
                  variant="pill"
                  icon={ArrowUpDown}
                  label={t("filters.sort")}
                  value={f.sort || "newest"}
                  onChange={(v) => setFilter("sort", v === "newest" ? "" : v)}
                  options={Object.keys(SORTS).map((k) => ({ value: k, label: t(`filters.sorts.${k}`) }))}
                />
              </div>
            </div>

            {demo && !loading && (
              <div className="sh-notice"><Info size={18} /> {t("properties.demoNotice")}</div>
            )}

            <div className="sh-chips">
              <p className="sh-results-count" aria-live="polite">
                {loading ? "…" : t("common.propertiesCount", { count: results.length })}
              </p>
              {chips.map((c) => (
                <button key={c.key} type="button" className="sh-chip" onClick={() => setFilter(c.key, "")}
                  aria-label={t("filters.remove", { label: c.label })}>
                  {c.label} <X size={14} />
                </button>
              ))}
            </div>

            {loading ? (
              <SkeletonGrid />
            ) : results.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title={t("properties.empty.title")}
                text={t("properties.empty.text")}
                action={<button type="button" className="sh-btn sh-btn--primary" onClick={clearAll}>{t("filters.clearAll")}</button>}
              />
            ) : (
              <div className="sh-grid">
                {results.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
