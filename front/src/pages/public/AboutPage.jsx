import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { ROUTES, propertiesUrl } from "@/app/routes";

const img = (id) => `https://images.unsplash.com/${id}?w=1000&auto=format&fit=crop&q=70`;

const OFFER_IMAGES = [
  img("photo-1580587771525-78b9dba3b914"),
  img("photo-1486406146926-c627a92ad1ab"),
  img("photo-1582407947304-fd86f028f716"),
];

const STATS = ["1%", "6", "2%", "100%"];
const RULE_NUMBERS = ["2%", "1×", "10%", "100%"];

export default function AboutPage() {
  const { t } = useTranslation();
  const offer = t("about.offer.items", { returnObjects: true });
  const rules = t("about.fees.items", { returnObjects: true });
  const missionPoints = t("about.mission.points", { returnObjects: true });
  const steps = t("about.how.steps", { returnObjects: true });
  const stats = t("about.stats", { returnObjects: true });

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="sh-about-hero">
        <div className="sh-container sh-about-hero__grid">
          <div>
            <span className="sh-eyebrow">{t("about.eyebrow")}</span>
            <h1 className="sh-h1" style={{ fontSize: "clamp(36px, 5vw, 58px)" }}>{t("about.title")}</h1>
            <p className="sh-lead">{t("about.lead")}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <Link to={ROUTES.properties} className="sh-btn sh-btn--primary">{t("about.browse")}</Link>
              <a href="#how" className="sh-btn sh-btn--ghost">{t("footer.howItWorks")}</a>
            </div>
          </div>
          <div className="sh-collage">
            <img src={img("photo-1600596542815-ffad4c1539a9")} alt="" />
            <img src={img("photo-1522708323590-d24dbb6b0267")} alt="" />
            <img src={img("photo-1560518883-ce09059eeffa")} alt="" />
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="sh-container" style={{ marginTop: 40 }}>
        <div className="sh-stats">
          {STATS.map((value, i) => (
            <div key={i} className="sh-stat"><strong>{value}</strong><span>{stats[i]}</span></div>
          ))}
        </div>
      </section>

      {/* ===== Mission ===== */}
      <section className="sh-section">
        <div className="sh-container sh-split">
          <div className="sh-split__img">
            <img src={img("photo-1613490493576-7fde63acd811")} alt="" />
          </div>
          <div>
            <span className="sh-eyebrow">{t("about.mission.eyebrow")}</span>
            <h2 className="sh-h2">{t("about.mission.title")}</h2>
            <p className="sh-lead">{t("about.mission.lead")}</p>
            <ul className="sh-checks">
              {missionPoints.map((point) => (
                <li key={point}><CheckCircle2 size={20} /> {point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== What we offer ===== */}
      <section className="sh-section sh-section--alt">
        <div className="sh-container">
          <div className="sh-section-head sh-section-head--center">
            <span className="sh-eyebrow">{t("about.offer.eyebrow")}</span>
            <h2 className="sh-h2">{t("about.offer.title")}</h2>
            <p className="sh-lead">{t("about.offer.lead")}</p>
          </div>
          <div className="sh-offer">
            {offer.map((item, i) => (
              <article key={item.title} className="sh-offer__card">
                <img src={OFFER_IMAGES[i]} alt="" loading="lazy" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="sh-section" id="how" style={{ scrollMarginTop: 80 }}>
        <div className="sh-container">
          <div className="sh-section-head">
            <div>
              <span className="sh-eyebrow">{t("footer.howItWorks")}</span>
              <h2 className="sh-h2">{t("about.how.title")}</h2>
            </div>
          </div>
          <div className="sh-steps">
            {steps.map((step, i) => (
              <div key={step.title} className="sh-step">
                <div className="sh-step__num">{i + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Fees & rules ===== */}
      <section className="sh-section sh-section--alt" id="fees" style={{ scrollMarginTop: 80 }}>
        <div className="sh-container">
          <div className="sh-section-head">
            <div>
              <span className="sh-eyebrow">{t("footer.fees")}</span>
              <h2 className="sh-h2">{t("about.fees.title")}</h2>
              <p className="sh-lead">{t("about.fees.lead")}</p>
            </div>
          </div>
          <div className="sh-rules">
            {rules.map((rule, i) => (
              <div key={rule.title} className="sh-rule">
                <span className="sh-rule__num">{RULE_NUMBERS[i]}</span>
                <div>
                  <h4>{rule.title}</h4>
                  <p>{rule.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="sh-section">
        <div className="sh-container">
          <div className="sh-cta">
            <div>
              <h2 className="sh-h2">{t("about.cta.title")}</h2>
              <p className="sh-lead">{t("about.cta.text")}</p>
              <div className="sh-cta__actions">
                <Link to={propertiesUrl({ deal: "partial" })} className="sh-btn sh-btn--light">
                  {t("about.cta.shares")} <ArrowRight size={16} className="sh-flip" />
                </Link>
                <Link to={ROUTES.listProperty} className="sh-btn sh-btn--ghost">{t("nav.listProperty")}</Link>
              </div>
            </div>
            <div className="sh-cta__img">
              <img src={img("photo-1600585154340-be6161a56a0c")} alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
