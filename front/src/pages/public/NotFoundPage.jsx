import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/app/routes";

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <section className="sh-404">
      <div>
        <strong>404</strong>
        <h1 className="sh-h2">{t("notFound.title")}</h1>
        <p className="sh-lead">{t("notFound.text")}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to={ROUTES.home} className="sh-btn sh-btn--primary">{t("notFound.home")}</Link>
          <Link to={ROUTES.properties} className="sh-btn sh-btn--ghost">{t("notFound.browse")}</Link>
        </div>
      </div>
    </section>
  );
}
