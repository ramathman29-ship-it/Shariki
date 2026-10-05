import { Link } from "react-router-dom";
import { House } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/app/routes";

export default function Brand({ to = ROUTES.home }) {
  const { t } = useTranslation();
  return (
    <Link to={to} className="sh-brand" aria-label={t("brand.homeLabel")}>
      <House size={26} strokeWidth={2.2} />
      {t("brand.name")}
    </Link>
  );
}
