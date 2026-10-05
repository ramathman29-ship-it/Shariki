import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3 } from "lucide-react";
import { reportsApi } from "@/api";
import { errorMessage } from "@/lib/errors";
import useAsync from "@/hooks/useAsync";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/Skeleton";

/** Rows per section: [translation key, path in the report]. `period` keys differ for daily/monthly. */
const SECTIONS = [
  { key: "users", rows: [["current", "users.new_today"], ["previous", "users.new_yesterday"], ["total", "users.total"], ["growth", "users.growth_rate"]] },
  { key: "properties", rows: [["notApproved", "properties.not_approved"], ["partialSold", "properties.partial_sold"], ["fullySold", "properties.fully_sold"], ["rent", "properties.rent"]] },
  { key: "requests", rows: [["current", "requests.today"], ["pending", "requests.pending"], ["accepted", "requests.accepted"], ["rejected", "requests.rejected"]] },
  {
    key: "sales",
    rows: [
      ["partialCurrent", "sales.partial_sales_today"], ["fullCurrent", "sales.full_sales_today"],
      ["partialPrevious", "sales.partial_sales_yesterday"], ["fullPrevious", "sales.full_sales_yesterday"],
      ["partialImprovement", "sales.partial_sales_improvement"], ["fullImprovement", "sales.full_sales_improvement"],
    ],
  },
];

const get = (obj, path) => path.split(".").reduce((o, k) => o?.[k], obj);

export default function ReportsPage() {
  const { t } = useTranslation();
  const [type, setType] = useState("daily");
  const { data: report, loading, error } = useAsync(() => reportsApi.get(type), [type]);

  return (
    <>
      <div className="sh-admin__head sh-section-head" style={{ alignItems: "center" }}>
        <div>
          <h1 className="sh-h2">{t("admin.nav.reports")}</h1>
          <p className="sh-lead">{t("admin.reports.lead")}</p>
        </div>
        <div className="sh-segment" role="tablist">
          {["daily", "monthly"].map((v) => (
            <button key={v} type="button" role="tab" aria-selected={type === v} className={type === v ? "is-active" : ""}
              onClick={() => setType(v)}>
              {t(`admin.reports.${v}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={4} height={260} />
      ) : error || !report ? (
        <EmptyState icon={BarChart3} title={t("errors.title")} text={errorMessage(error, t)} />
      ) : (
        <div className="sh-report-grid">
          {SECTIONS.map((section) => (
            <section key={section.key} className="sh-report">
              <h3>{t(`admin.reports.sections.${section.key}`)}</h3>
              <dl>
                {section.rows.map(([label, path]) => (
                  <div key={label}>
                    <dt>{t(`admin.reports.rows.${label}`, { context: type })}</dt>
                    <dd>{get(report, path) ?? "—"}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
