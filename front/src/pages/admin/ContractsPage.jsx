import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileSignature, Upload, FileText } from "lucide-react";
import { requestsApi } from "@/api";
import { errorMessage } from "@/lib/errors";
import useAsync from "@/hooks/useAsync";
import useToast from "@/hooks/useToast";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonList } from "@/components/ui/Skeleton";
import RequestRow from "@/components/account/RequestRow";

/** Admin: upload the signed contract for accepted requests. */
export default function ContractsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: requests, setData, loading } = useAsync(requestsApi.accepted, [], []);
  const [busy, setBusy] = useState(null);

  const upload = async (id, file) => {
    if (!file) return;
    setBusy(id);
    try {
      const res = await requestsApi.uploadContract(id, file);
      setData((list) => list.map((r) => (r.id === id ? { ...r, contract_image: res.contract_url || URL.createObjectURL(file) } : r)));
      toast.success(t("admin.contracts.uploaded"));
    } catch (err) {
      toast.error(errorMessage(err, t));
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="sh-admin__head">
        <h1 className="sh-h2">{t("admin.nav.contracts")}</h1>
        <p className="sh-lead">{t("admin.contracts.lead")}</p>
      </div>

      {loading ? (
        <SkeletonList />
      ) : requests.length === 0 ? (
        <EmptyState icon={FileSignature} title={t("admin.contracts.empty.title")} text={t("admin.contracts.empty.text")} />
      ) : (
        <div className="sh-list">
          {requests.map((r) => (
            <RequestRow
              key={r.id}
              request={r}
              showRequester
              actions={
                <>
                  {r.contract_image && (
                    <a href={r.contract_image} target="_blank" rel="noreferrer" className="sh-btn sh-btn--ghost sh-btn--sm">
                      <FileText size={15} /> {t("myProperties.contract")}
                    </a>
                  )}
                  <label className={`sh-btn sh-btn--primary sh-btn--sm ${busy === r.id ? "is-busy" : ""}`}>
                    <Upload size={15} /> {busy === r.id ? t("common.uploading") : r.contract_image ? t("admin.contracts.replace") : t("admin.contracts.upload")}
                    <input type="file" hidden accept="image/*,application/pdf" disabled={busy === r.id}
                      onChange={(e) => upload(r.id, e.target.files[0])} />
                  </label>
                </>
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
