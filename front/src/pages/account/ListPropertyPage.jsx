import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ImagePlus, X } from "lucide-react";
import { propertiesApi, fieldErrors } from "@/api";
import { ROUTES } from "@/app/routes";
import { CONDITIONS, DEAL_TO_API } from "@/lib/property";
import { errorMessage } from "@/lib/errors";
import useToast from "@/hooks/useToast";
import usePropertyText from "@/hooks/usePropertyText";
import PageHeader from "@/components/ui/PageHeader";

const DEALS = ["sale", "partial", "rent"];
const TYPES = ["Apartment", "Villa", "House", "Penthouse", "Studio", "Chalet", "Office", "Shop", "Land"];

const EMPTY = {
  deal: "sale",
  location: "",
  project: "",
  address: "",
  type: "",
  condition: "",
  area: "",
  price: "",
  available_percentage: "",
  description: "",
};

export default function ListPropertyPage() {
  const { t } = useTranslation();
  const text = usePropertyText();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const addImages = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
    e.target.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();

    const partial = form.deal === "partial";
    const share = Number(form.available_percentage);
    if (partial && (share < 1 || share > 99)) {
      setErrors({ available_percentage: t("list.errors.share") });
      return;
    }

    const data = new FormData();
    data.append("type_request", DEAL_TO_API[form.deal]);
    // whole-property listings stay 100% available (0% would mark them "done")
    data.append("available_percentage", partial ? share : 100);
    data.append("status", "pending");
    ["location", "project", "address", "type", "condition", "area", "price", "description"].forEach((k) =>
      data.append(k, form[k])
    );
    images.forEach((img) => data.append("images[]", img));

    setSubmitting(true);
    try {
      await propertiesApi.create(data);
      toast.success(t("list.submitted"));
      navigate(ROUTES.account.properties);
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, t));
    } finally {
      setSubmitting(false);
    }
  };

  const input = (key, props = {}) => (
    <label className={`sh-field ${props.full ? "sh-field--full" : ""}`}>
      <span className="sh-label">{props.label || t(`list.fields.${key}`)}</span>
      <input className={`sh-input ${errors[key] ? "is-invalid" : ""}`} value={form[key]} onChange={set(key)}
        placeholder={t(`list.placeholders.${key}`, { defaultValue: "" })} {...props} full={undefined} label={undefined} />
      {errors[key] && <span className="sh-error">{errors[key]}</span>}
    </label>
  );

  return (
    <>
      <PageHeader
        crumbs={[{ label: t("nav.home"), to: ROUTES.home }, { label: t("nav.listProperty") }]}
        title={t("nav.listProperty")}
        lead={t("list.lead")}
      />

      <div className="sh-container">
        <div className="sh-sell">
          <form className="sh-form-card" onSubmit={submit}>
            <div className="sh-form-section">
              <h3>{t("list.sections.deal.title")}</h3>
              <p>{t("list.sections.deal.text")}</p>
              <div className="sh-choice" role="radiogroup">
                {DEALS.map((d) => (
                  <label key={d} className={form.deal === d ? "is-active" : ""}>
                    <input type="radio" name="deal" value={d} checked={form.deal === d} onChange={set("deal")} />
                    <strong>{t(`list.deals.${d}.title`)}</strong>
                    <span>{t(`list.deals.${d}.text`)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="sh-form-section">
              <h3>{t("list.sections.location.title")}</h3>
              <p>{t("list.sections.location.text")}</p>
              <div className="sh-form-grid">
                {input("location", { required: true })}
                {input("project")}
                {input("address", { required: true, full: true })}
              </div>
            </div>

            <div className="sh-form-section">
              <h3>{t("list.sections.details.title")}</h3>
              <p>{t("list.sections.details.text")}</p>
              <div className="sh-form-grid">
                <label className="sh-field">
                  <span className="sh-label">{t("list.fields.type")}</span>
                  <select className="sh-select" value={form.type} onChange={set("type")} required>
                    <option value="" hidden>{t("common.select")}</option>
                    {TYPES.map((v) => <option key={v} value={v}>{text.type(v)}</option>)}
                  </select>
                </label>
                <label className="sh-field">
                  <span className="sh-label">{t("list.fields.condition")}</span>
                  <select className="sh-select" value={form.condition} onChange={set("condition")} required>
                    <option value="" hidden>{t("common.select")}</option>
                    {Object.entries(CONDITIONS).map(([code, c]) => (
                      <option key={code} value={code}>{t(`condition.${c.key}`)}</option>
                    ))}
                  </select>
                </label>
                {input("area", { type: "number", min: 1, required: true })}
                {input("price", { type: "number", min: 0, required: true, label: t(`list.priceLabel.${form.deal}`) })}
                {form.deal === "partial" &&
                  input("available_percentage", { type: "number", min: 1, max: 99, required: true, full: true })}
                <label className="sh-field sh-field--full">
                  <span className="sh-label">{t("list.fields.description")}</span>
                  <textarea className="sh-input" rows="4" value={form.description} onChange={set("description")}
                    placeholder={t("list.placeholders.description")} />
                </label>
              </div>
            </div>

            <div className="sh-form-section">
              <h3>{t("list.sections.photos.title")}</h3>
              <p>{t("list.sections.photos.text")}</p>
              <label className="sh-dropzone">
                <ImagePlus size={28} />
                <strong>{t("list.addPhotos")}</strong>
                {t("list.photoHint")}
                <input type="file" multiple hidden accept="image/jpeg,image/png,image/webp" onChange={addImages} />
              </label>
              {previews.length > 0 && (
                <div className="sh-thumbs">
                  {previews.map((src, i) => (
                    <div key={src}>
                      <img src={src} alt="" />
                      <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label={t("list.removePhoto")}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sh-form-section" style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="sh-btn sh-btn--ghost" onClick={() => navigate(-1)}>{t("common.cancel")}</button>
              <button type="submit" className="sh-btn sh-btn--primary" disabled={submitting}>
                {submitting ? t("list.submitting") : t("list.submit")}
              </button>
            </div>
          </form>

          <aside className="sh-sell__aside">
            <div className="sh-aside-card">
              <h4>{t("list.next.title")}</h4>
              <ol className="sh-mini-steps">
                {t("list.next.steps", { returnObjects: true }).map((s, i) => (
                  <li key={i}><b>{i + 1}</b> {s}</li>
                ))}
              </ol>
            </div>
            <div className="sh-aside-card">
              <h4>{t("list.feesTitle")}</h4>
              <ul className="sh-mini-steps">
                <li><b>%</b> {t("list.fees.sale")}</li>
                <li><b>$</b> {t("list.fees.rent")}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
