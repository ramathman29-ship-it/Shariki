import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, ClipboardCheck, Eye } from "lucide-react";
import { propertiesApi } from "@/api";
import { errorMessage } from "@/lib/errors";
import { dealOf } from "@/lib/property";
import useAsync from "@/hooks/useAsync";
import useToast from "@/hooks/useToast";
import usePropertyText from "@/hooks/usePropertyText";
import { ROUTES } from "@/app/routes";
import PropertyCard from "@/components/property/PropertyCard";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { SkeletonGrid } from "@/components/ui/Skeleton";

const loadPending = async () => (await propertiesApi.pending()).filter((p) => p.status === "pending");

/** Admin: approve or reject newly listed properties. */
export default function ListingApprovalsPage() {
  const { t } = useTranslation();
  const text = usePropertyText();
  const toast = useToast();
  const { data: pending, setData, loading } = useAsync(loadPending, [], []);
  const [busy, setBusy] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const decide = async (id, approve) => {
    setBusy(id);
    try {
      await (approve ? propertiesApi.approve(id) : propertiesApi.reject(id));
      setData((list) => list.filter((p) => p.id !== id));
      toast.success(t(approve ? "admin.listings.approved" : "admin.listings.rejected"));
    } catch (err) {
      toast.error(errorMessage(err, t));
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="sh-admin__head">
        <h1 className="sh-h2">{t("admin.nav.listings")}</h1>
        <p className="sh-lead">{t("admin.listings.lead")}</p>
      </div>

      {loading ? (
        <SkeletonGrid count={3} />
      ) : pending.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title={t("admin.listings.empty.title")} text={t("admin.listings.empty.text")} />
      ) : (
        <div className="sh-grid">
          {pending.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              as="article"
              badges={
                <>
                  <span className={`sh-badge sh-badge--${dealOf(p)}`}>{text.dealShort(p)}</span>
                  <span className="sh-badge">#{p.id}</span>
                </>
              }
              footer={
                <>
                  <button type="button" className="sh-btn sh-btn--success sh-btn--sm" disabled={busy === p.id}
                    onClick={() => decide(p.id, true)}>
                    <Check size={15} /> {t("admin.listings.approve")}
                  </button>
                  <button type="button" className="sh-btn sh-btn--danger sh-btn--sm" disabled={busy === p.id}
                    onClick={() => setConfirm({
                      title: t("admin.listings.confirmReject.title"),
                      text: t("admin.listings.confirmReject.text"),
                      label: t("requests.reject"),
                      danger: true,
                      onConfirm: () => decide(p.id, false),
                    })}>
                    <X size={15} /> {t("requests.reject")}
                  </button>
                </>
              }
            >
              <div className="sh-card__specs">
                <span>{text.condition(p)}</span>
                {p.area && <span>{t("property.area", { value: p.area })}</span>}
                <a className="sh-text-btn" href={ROUTES.property(p.id)} target="_blank" rel="noreferrer"
                  style={{ marginInlineStart: "auto", display: "inline-flex", gap: 4, alignItems: "center" }}>
                  <Eye size={14} /> {t("common.view")}
                </a>
              </div>
            </PropertyCard>
          ))}
        </div>
      )}
      <ConfirmDialog confirm={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
