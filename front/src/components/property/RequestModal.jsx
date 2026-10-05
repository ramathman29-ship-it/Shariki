import { useState } from "react";
import { useTranslation } from "react-i18next";
import { requestsApi } from "@/api";
import { dealOf } from "@/lib/property";
import { errorMessage } from "@/lib/errors";
import useToast from "@/hooks/useToast";
import usePropertyText from "@/hooks/usePropertyText";
import Modal from "@/components/ui/Modal";

/** Form to request buying, renting or a share of a property. */
export default function RequestModal({ property, initialShare, onClose }) {
  const { t } = useTranslation();
  const text = usePropertyText();
  const toast = useToast();
  const deal = dealOf(property);
  const available = Number(property.available_percentage ?? 100);
  const [message, setMessage] = useState("");
  const [rate, setRate] = useState(deal === "partial" ? initialShare : "");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await requestsApi.create({ propertyId: property.id, message, rate: deal === "partial" ? Number(rate) : undefined });
      toast.success(t("details.request.sent"));
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, t));
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open
      as="form"
      onSubmit={submit}
      onClose={onClose}
      title={t("details.request.title")}
      description={`${property.project || property.address} · ${text.city(property.location)}`}
    >
      <div style={{ display: "grid", gap: 16 }}>
        {deal === "partial" && (
          <label className="sh-field">
            <span className="sh-label">{t("details.request.share", { max: available })}</span>
            <input className="sh-input" type="number" min="1" max={available} required value={rate}
              onChange={(e) => setRate(e.target.value)} />
          </label>
        )}
        <label className="sh-field">
          <span className="sh-label">{t("details.request.message")}</span>
          <textarea className="sh-input" rows="4" required placeholder={t("details.request.placeholder")}
            value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
      </div>

      <div className="sh-modal__actions">
        <button type="button" className="sh-btn sh-btn--ghost" onClick={onClose}>{t("common.cancel")}</button>
        <button type="submit" className="sh-btn sh-btn--primary" disabled={sending}>
          {sending ? t("common.sending") : t("details.request.submit")}
        </button>
      </div>
    </Modal>
  );
}
