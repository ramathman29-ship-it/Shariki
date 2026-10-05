/** User-facing text for an API error. */
export function errorMessage(err, t) {
  if (err?.status === 0) return t("errors.network");
  if (err?.status === 403) return t("errors.forbidden");
  return err?.message && err.message !== "Request failed" ? err.message : t("errors.generic");
}
