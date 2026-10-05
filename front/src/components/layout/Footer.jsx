import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail } from "lucide-react";
import { ROUTES, propertiesUrl } from "@/app/routes";
import Brand from "@/components/ui/Brand";

export default function Footer() {
  const { t } = useTranslation();
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="sh-footer">
      <div className="sh-container">
        <div className="sh-footer__grid">
          <div>
            <Brand />
            <p>{t("footer.tagline")}</p>
            <div className="sh-footer__contact">
              <span><MapPin size={16} /> {t("footer.address")}</span>
              <span dir="ltr"><Phone size={16} /> +963 11 234 5678</span>
              <span><Mail size={16} /> hello@shariki.sy</span>
            </div>
          </div>

          <div>
            <h5>{t("footer.explore")}</h5>
            <ul>
              <li><Link to={ROUTES.properties}>{t("footer.allProperties")}</Link></li>
              <li><Link to={propertiesUrl({ deal: "sale" })}>{t("deal.sale")}</Link></li>
              <li><Link to={propertiesUrl({ deal: "partial" })}>{t("deal.partial")}</Link></li>
              <li><Link to={propertiesUrl({ deal: "rent" })}>{t("deal.rent")}</Link></li>
            </ul>
          </div>

          <div>
            <h5>{t("footer.company")}</h5>
            <ul>
              <li><Link to={ROUTES.about}>{t("nav.about")}</Link></li>
              <li><Link to={`${ROUTES.about}#how`}>{t("footer.howItWorks")}</Link></li>
              <li><Link to={`${ROUTES.about}#fees`}>{t("footer.fees")}</Link></li>
              <li><Link to={ROUTES.listProperty}>{t("nav.listProperty")}</Link></li>
            </ul>
          </div>

          <div>
            <h5>{t("footer.newsletter")}</h5>
            <p>{t("footer.newsletterText")}</p>
            {subscribed ? (
              <p style={{ marginTop: 16, color: "#fff", fontWeight: 600 }}>{t("footer.subscribed")}</p>
            ) : (
              <form
                className="sh-footer__form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input type="email" placeholder={t("footer.emailPlaceholder")} aria-label={t("footer.emailPlaceholder")} required />
                <button type="submit" className="sh-btn sh-btn--light sh-btn--sm">{t("footer.subscribe")}</button>
              </form>
            )}
          </div>
        </div>

        <div className="sh-footer__bottom">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
          <span>{t("footer.registration")}</span>
        </div>
      </div>
    </footer>
  );
}
