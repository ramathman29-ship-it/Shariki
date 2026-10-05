import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, PieChart, Plus, Trash2, Eye, FileText, Clock, CalendarDays } from "lucide-react";
import { propertiesApi, requestsApi } from "@/api";
import { ROUTES, propertiesUrl } from "@/app/routes";
import { dealOf, ownedPercent } from "@/lib/property";
import { formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/errors";
import useAsync from "@/hooks/useAsync";
import useToast from "@/hooks/useToast";
import usePropertyText from "@/hooks/usePropertyText";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Lightbox from "@/components/ui/Lightbox";
import Tabs from "@/components/ui/Tabs";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import PropertyCard from "@/components/property/PropertyCard";
import ShareProgress from "@/components/property/ShareProgress";

const STATUS_TONE = { pending: "ok", view: "good", done: "soft" };

const load = async () => {
  const [properties, shares] = await Promise.all([propertiesApi.mine(), requestsApi.myShares()]);
  return { properties, shares };
};

export default function MyPropertiesPage() {
  const { t } = useTranslation();
  const text = usePropertyText();
  const toast = useToast();
  const { data, setData, loading } = useAsync(load, [], { properties: [], shares: [] });
  const { properties, shares } = data;
  const [tab, setTab] = useState("properties");
  const [confirm, setConfirm] = useState(null);
  const [contract, setContract] = useState(null);

  const remove = async (property) => {
    try {
      await propertiesApi.remove(property.id);
      setData((d) => ({ ...d, properties: d.properties.filter((p) => p.id !== property.id) }));
      toast.success(t("myProperties.deleted"));
    } catch (err) {
      toast.error(errorMessage(err, t));
    }
  };

  const live = properties.filter((p) => p.status === "view").length;
  const portfolio = shares.reduce((sum, s) => sum + (Number(s.property?.price) * Number(s.share_amount)) / 100, 0);
  const kpis = [
    [t("myProperties.kpi.listings"), properties.length],
    [t("myProperties.kpi.live"), live],
    [t("myProperties.kpi.shares"), shares.length],
    [t("myProperties.kpi.value"), formatMoney(portfolio)],
  ];

  const listingCard = (p) => {
    const deal = dealOf(p);
    const owned = ownedPercent(p);
    return (
      <PropertyCard
        key={p.id}
        property={p}
        as="article"
        badges={
          <>
            <span className={`sh-badge sh-badge--${deal}`}>{text.dealShort(p)}</span>
            <span className={`sh-badge sh-badge--${STATUS_TONE[p.status] || "soft"}`}>
              {p.status === "pending" && <Clock size={12} />} {t(`myProperties.status.${p.status}`, { defaultValue: p.status })}
            </span>
          </>
        }
        footer={
          <>
            {p.status === "pending" ? (
              <span className="sh-req__hint" style={{ flex: 1, alignSelf: "center" }}>{t("myProperties.pendingHint")}</span>
            ) : (
              <Link to={ROUTES.property(p.id)} className="sh-btn sh-btn--ghost sh-btn--sm"><Eye size={15} /> {t("common.view")}</Link>
            )}
            {p.status === "view" && (
              <button type="button" className="sh-btn sh-btn--danger sh-btn--sm"
                onClick={() => setConfirm({
                  title: t("myProperties.confirmDelete.title"),
                  text: t("myProperties.confirmDelete.text", { name: p.project || p.address }),
                  label: t("common.delete"),
                  danger: true,
                  onConfirm: () => remove(p),
                })}>
                <Trash2 size={15} /> {t("common.delete")}
              </button>
            )}
          </>
        }
      >
        {deal === "partial" ? (
          <ShareProgress style={{ paddingTop: 16 }} percent={owned}
            start={t("myProperties.soldToInvestors", { value: owned })} end={t("details.open", { value: p.available_percentage })} />
        ) : null}
      </PropertyCard>
    );
  };

  const shareCard = (s) => {
    const p = s.property || {};
    return (
      <PropertyCard
        key={s.id}
        property={p}
        as="article"
        badges={<span className="sh-badge sh-badge--partial">{t("property.owned", { value: s.share_amount })}</span>}
        footer={
          <>
            {p.id && <Link to={ROUTES.property(p.id)} className="sh-btn sh-btn--ghost sh-btn--sm"><Eye size={15} /> {t("myProperties.property")}</Link>}
            {s.contract ? (
              <button type="button" className="sh-btn sh-btn--primary sh-btn--sm" onClick={() => setContract(s.contract)}>
                <FileText size={15} /> {t("myProperties.contract")}
              </button>
            ) : (
              <span className="sh-req__hint" style={{ flex: 1, alignSelf: "center" }}>{t("myProperties.contractPending")}</span>
            )}
          </>
        }
      >
        <ShareProgress style={{ paddingTop: 16 }} percent={s.share_amount}
          start={t("myProperties.shareValue", { value: formatMoney((Number(p.price) * s.share_amount) / 100) })}
          end={t("myProperties.shareOf", { value: s.share_amount, total: formatMoney(p.price) })} />
        <div className="sh-req__meta"><span><CalendarDays size={14} /> {t("myProperties.since", { date: s.submission_date || "—" })}</span></div>
      </PropertyCard>
    );
  };

  let content;
  if (loading) content = <SkeletonGrid count={3} />;
  else if (tab === "properties")
    content = properties.length ? (
      <div className="sh-grid">{properties.map(listingCard)}</div>
    ) : (
      <EmptyState icon={Building2} title={t("myProperties.empty.listings.title")} text={t("myProperties.empty.listings.text")}
        action={<Link to={ROUTES.listProperty} className="sh-btn sh-btn--primary">{t("myProperties.empty.listings.cta")}</Link>} />
    );
  else
    content = shares.length ? (
      <div className="sh-grid">{shares.map(shareCard)}</div>
    ) : (
      <EmptyState icon={PieChart} title={t("myProperties.empty.shares.title")} text={t("myProperties.empty.shares.text")}
        action={<Link to={propertiesUrl({ deal: "partial" })} className="sh-btn sh-btn--primary">{t("about.cta.shares")}</Link>} />
    );

  return (
    <>
      <PageHeader
        crumbs={[{ label: t("nav.home"), to: ROUTES.home }, { label: t("nav.myProperties") }]}
        title={t("nav.myProperties")}
        lead={t("myProperties.lead")}
        actions={<Link to={ROUTES.listProperty} className="sh-btn sh-btn--primary"><Plus size={16} /> {t("myProperties.add")}</Link>}
      />
      <div className="sh-container sh-account">
        <div className="sh-kpis">
          {kpis.map(([label, value]) => (
            <div key={label} className="sh-kpi"><span>{label}</span><strong>{loading ? "…" : value}</strong></div>
          ))}
        </div>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "properties", label: t("myProperties.tabs.listings"), icon: Building2, count: properties.length },
            { value: "shares", label: t("myProperties.tabs.shares"), icon: PieChart, count: shares.length },
          ]}
        />
        {content}
      </div>
      <ConfirmDialog confirm={confirm} onClose={() => setConfirm(null)} />
      <Lightbox images={contract ? [contract] : []} index={contract ? 0 : null} onChange={() => {}} onClose={() => setContract(null)} />
    </>
  );
}
