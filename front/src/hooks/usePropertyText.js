import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { conditionOf, dealOf } from "@/lib/property";
import { formatMoney } from "@/lib/format";

/**
 * Translated labels for property data. City/type/feature names come from the
 * database in English, so known values are translated and unknown ones shown as-is.
 */
export default function usePropertyText() {
  const { t } = useTranslation();

  const data = useCallback(
    (group, value) => (value ? t(`data.${group}.${value}`, { defaultValue: value }) : ""),
    [t]
  );

  return useMemo(
    () => ({
      deal: (p) => t(`deal.${dealOf(p)}`),
      dealShort: (p) => t(`deal.short.${dealOf(p)}`),
      condition: (p) => {
        const c = conditionOf(p);
        return c.key ? t(`condition.${c.key}`) : p?.condition || "—";
      },
      city: (v) => data("cities", v),
      type: (v) => data("types", v),
      featureTitle: (v) => data("features", v),
      featureValue: (v) => data("values", v),
      /** "$650" + whether it is per month */
      price: (p) => ({ amount: formatMoney(p?.price), monthly: dealOf(p) === "rent" }),
    }),
    [t, data]
  );
}
