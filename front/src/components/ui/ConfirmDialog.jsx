import { useTranslation } from "react-i18next";
import Modal from "./Modal";

/**
 * Yes/no confirmation. Pass `confirm = { title, text, label?, danger?, onConfirm }` to open, null to close.
 */
export default function ConfirmDialog({ confirm, onClose }) {
  const { t } = useTranslation();
  if (!confirm) return null;

  return (
    <Modal open onClose={onClose} title={confirm.title} description={confirm.text}>
      <div className="sh-modal__actions">
        <button type="button" className="sh-btn sh-btn--ghost" onClick={onClose}>
          {t("common.cancel")}
        </button>
        <button
          type="button"
          className={`sh-btn ${confirm.danger ? "sh-btn--danger" : "sh-btn--primary"}`}
          onClick={() => {
            confirm.onConfirm();
            onClose();
          }}
        >
          {confirm.label || t("common.confirm")}
        </button>
      </div>
    </Modal>
  );
}
