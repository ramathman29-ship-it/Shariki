import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ClipboardCheck, FileSignature, BarChart3, ArrowRight } from "lucide-react";
import { propertiesApi, requestsApi } from "@/api";
import { ROUTES } from "@/app/routes";
import useAsync from "@/hooks/useAsync";

const load = async () => {
  const [pending, accepted] = await Promise.all([
    propertiesApi.pending().catch(() => []),
    requestsApi.accepted().catch(() => []),
  ]);
  return {
    listings: pending.filter((p) => p.status === "pending").length,
    contracts: accepted.filter((r) => !r.contract_image).length,
  };
};

export default function AdminOverviewPage() {
  const { t } = useTranslation();
  const { data, loading } = useAsync(load, [], { listings: 0, contracts: 0 });

  const cards = [
    { key: "listings", to: ROUTES.admin.listings, icon: ClipboardCheck, count: data.listings },
    { key: "contracts", to: ROUTES.admin.contracts, icon: FileSignature, count: data.contracts },
    { key: "reports", to: ROUTES.admin.reports, icon: BarChart3 },
  ];

  return (
    <>
      <div className="sh-admin__head">
        <h1 className="sh-h2">{t("admin.nav.overview")}</h1>
        <p className="sh-lead">{t("admin.overview.lead")}</p>
      </div>
      <div className="sh-deals">
        {cards.map(({ key, to, icon: Icon, count }) => (
          <Link key={key} to={to} className="sh-deal" style={{ background: "var(--sh-surface)" }}>
            <span className="sh-deal__icon"><Icon size={24} /></span>
            {count !== undefined && <strong className="sh-admin__count">{loading ? "…" : count}</strong>}
            <h3>{t(`admin.overview.${key}.title`)}</h3>
            <p>{t(`admin.overview.${key}.text`)}</p>
            <span className="sh-link">{t("common.open")} <ArrowRight size={16} className="sh-flip" /></span>
          </Link>
        ))}
      </div>
    </>
  );
}
