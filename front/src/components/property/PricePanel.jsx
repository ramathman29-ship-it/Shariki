import { useTranslation } from "react-i18next";
import { Send, ShieldCheck } from "lucide-react";
import { dealOf, ownedPercent } from "@/lib/property";
import { formatMoney } from "@/lib/format";
import Price from "./Price";
import ShareProgress from "./ShareProgress";

/** Sticky side panel on the details page: price, share calculator, request button. */
export default function PricePanel({ property, share, onShareChange, onRequest }) {
  const { t } = useTranslation();
  const deal = dealOf(property);
  const available = Number(property.available_percentage ?? 100);
  const owned = ownedPercent(property);
  const soldOut = deal === "partial" && available <= 0;

  return (
    <aside className="sh-panel">
      <p className="sh-panel__label">{t(`details.priceLabel.${deal}`)}</p>
      <Price property={property} className="sh-panel__price" />

      {deal === "partial" && (
        <>
          <hr />
          <ShareProgress
            percent={owned}
            start={t("details.ownedByInvestors", { value: owned })}
            end={t("details.open", { value: available })}
          />
          {available > 0 && (
            <div className="sh-calc" style={{ marginTop: 22 }}>
              <div className="sh-calc__row">
                <span>{t("details.yourShare")}</span>
                <strong>{share}%</strong>
              </div>
              <input type="range" min="1" max={available} value={share}
                onChange={(e) => onShareChange(Number(e.target.value))} aria-label={t("details.yourShare")} />
              <div className="sh-calc__row">
                <span>{t("details.estimatedCost")}</span>
                <strong>{formatMoney((Number(property.price) * share) / 100)}</strong>
              </div>
            </div>
          )}
        </>
      )}

      <hr />
      <button type="button" className="sh-btn sh-btn--primary sh-btn--block" onClick={onRequest} disabled={soldOut}>
        <Send size={16} className="sh-flip" /> {t(`details.requestCta.${deal}`)}
      </button>
      <p className="sh-panel__note">
        <ShieldCheck size={16} /> {t("details.legalNote")}
      </p>
    </aside>
  );
}
