import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Inbox, Send, Check, X, Wallet, ShieldCheck } from "lucide-react";
import { requestsApi } from "@/api";
import { ROUTES } from "@/app/routes";
import { errorMessage } from "@/lib/errors";
import useAsync from "@/hooks/useAsync";
import useToast from "@/hooks/useToast";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Tabs from "@/components/ui/Tabs";
import { SkeletonList } from "@/components/ui/Skeleton";
import RequestRow from "@/components/account/RequestRow";
import PaymentModal from "@/components/account/PaymentModal";

export default function MyRequestsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const { data, setData, loading, error, reload } = useAsync(requestsApi.mine, [], { sent: [], received: [] });
  const [tabChoice, setTab] = useState(null);
  const [busy, setBusy] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [paying, setPaying] = useState(null); // request being paid for

  // open "received" by default when only that list has something
  const tab = tabChoice ?? (!data.sent.length && data.received.length ? "received" : "sent");

  const updateList = (list, id, patch) =>
    setData((d) => ({
      ...d,
      [list]: patch === null ? d[list].filter((r) => r.id !== id) : d[list].map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));

  /** Runs an API action, then patches the list (`null` patch removes the row). */
  const act = async (id, call, list, patch, successKey) => {
    setBusy(id);
    try {
      await call();
      updateList(list, id, patch);
      toast.success(t(successKey));
    } catch (err) {
      toast.error(errorMessage(err, t));
    } finally {
      setBusy(null);
    }
  };

  const sentActions = (r) => (
    <>
      {r.status === "pending" && (
        <button type="button" className="sh-btn sh-btn--danger sh-btn--sm" disabled={busy === r.id}
          onClick={() => setConfirm({
            title: t("requests.confirmCancel.title"),
            text: t("requests.confirmCancel.text"),
            label: t("requests.cancel"),
            danger: true,
            onConfirm: () => act(r.id, () => requestsApi.cancel(r.id), "sent", null, "requests.toast.cancelled"),
          })}>
          <X size={15} /> {t("requests.cancel")}
        </button>
      )}
      {r.status === "accepted" && r.payment_status === "pending" && (
        <>
          <button type="button" className="sh-btn sh-btn--primary sh-btn--sm" disabled={busy === r.id}
            onClick={() => setPaying(r)}>
            <Wallet size={15} /> {t("requests.holdPayment")}
          </button>
          <p className="sh-req__hint">{t("requests.holdHint")}</p>
        </>
      )}
      {r.payment_status === "held" && r.status !== "rejected" && (
        <>
          <span className="sh-badge sh-badge--good" style={{ justifyContent: "center" }}>
            <ShieldCheck size={14} /> {t("requests.paymentHeld")}
          </span>
          <button type="button" className="sh-btn sh-btn--danger sh-btn--sm" disabled={busy === r.id}
            onClick={() => setConfirm({
              title: t("requests.confirmRelease.title"),
              text: t("requests.confirmRelease.text"),
              danger: true,
              onConfirm: () => act(r.id, () => requestsApi.releasePayment(r.id), "sent",
                { payment_status: "canceled", status: "rejected" }, "requests.toast.released"),
            })}>
            {t("requests.changedMind")}
          </button>
        </>
      )}
    </>
  );

  const receivedActions = (r) =>
    r.status === "pending" && (
      <>
        <button type="button" className="sh-btn sh-btn--success sh-btn--sm" disabled={busy === r.id}
          onClick={() => act(r.id, () => requestsApi.decide(r.id, "accepted"), "received", { status: "accepted" }, "requests.toast.accepted")}>
          <Check size={15} /> {t("requests.accept")}
        </button>
        <button type="button" className="sh-btn sh-btn--danger sh-btn--sm" disabled={busy === r.id}
          onClick={() => setConfirm({
            title: t("requests.confirmReject.title"),
            text: t("requests.confirmReject.text"),
            label: t("requests.reject"),
            danger: true,
            onConfirm: () => act(r.id, () => requestsApi.decide(r.id, "rejected"), "received", { status: "rejected" }, "requests.toast.rejected"),
          })}>
          <X size={15} /> {t("requests.reject")}
        </button>
      </>
    );

  const list = data[tab];
  const pendingReceived = data.received.filter((r) => r.status === "pending").length;

  let content;
  if (loading) content = <SkeletonList />;
  else if (error)
    content = (
      <EmptyState icon={Inbox} title={t("errors.title")} text={errorMessage(error, t)}
        action={<button type="button" className="sh-btn sh-btn--primary" onClick={reload}>{t("common.retry")}</button>} />
    );
  else if (!list.length)
    content = (
      <EmptyState
        icon={tab === "sent" ? Send : Inbox}
        title={t(`requests.empty.${tab}.title`)}
        text={t(`requests.empty.${tab}.text`)}
        action={
          <Link to={tab === "sent" ? ROUTES.properties : ROUTES.listProperty} className="sh-btn sh-btn--primary">
            {t(`requests.empty.${tab}.cta`)}
          </Link>
        }
      />
    );
  else
    content = (
      <div className="sh-list">
        {list.map((r) => (
          <RequestRow key={r.id} request={r} showRequester={tab === "received"}
            actions={tab === "sent" ? sentActions(r) : receivedActions(r)} />
        ))}
      </div>
    );

  return (
    <>
      <PageHeader
        crumbs={[{ label: t("nav.home"), to: ROUTES.home }, { label: t("nav.myRequests") }]}
        title={t("nav.myRequests")}
        lead={t("requests.lead")}
      />
      <div className="sh-container sh-account">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "sent", label: t("requests.tabs.sent"), icon: Send, count: data.sent.length },
            {
              value: "received",
              label: t("requests.tabs.received"),
              icon: Inbox,
              count: data.received.length,
              extra: pendingReceived > 0 && <span className="sh-badge sh-badge--ok">{t("requests.new", { count: pendingReceived })}</span>,
            },
          ]}
        />
        {content}
      </div>
      <ConfirmDialog confirm={confirm} onClose={() => setConfirm(null)} />
      <PaymentModal
        request={paying}
        onClose={() => setPaying(null)}
        onHeld={() => {
          updateList("sent", paying.id, { payment_status: "held" });
          setPaying(null);
          toast.success(t("requests.toast.held"));
        }}
      />
    </>
  );
}
