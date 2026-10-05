import { useTranslation } from "react-i18next";
import usePropertyText from "@/hooks/usePropertyText";

/** "$650 / month" for rentals, "$245,000" otherwise. */
export default function Price({ property, className = "sh-card__price" }) {
  const { t } = useTranslation();
  const { amount, monthly } = usePropertyText().price(property);
  return (
    <p className={className}>
      {amount} {monthly && <small>{t("property.perMonth")}</small>}
    </p>
  );
}
