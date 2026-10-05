import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { AlertCircle, Lock, ShieldCheck } from "lucide-react";
import { requestsApi } from "@/api";
import { errorMessage } from "@/lib/errors";
import { formatMoney } from "@/lib/format";
import { getStripe, stripeAppearance, STRIPE_KEY, STRIPE_TEST_MODE } from "@/lib/stripe";
import Modal from "@/components/ui/Modal";

const FONTS = [{ cssSrc: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap" }];

/**
 * Card form that holds (authorizes, doesn't charge) the amount for an accepted request.
 * Flow: POST /payment → client_secret → stripe.confirmPayment → POST /payment/confirm.
 */
export default function PaymentModal({ request, onClose, onHeld }) {
  const { t, i18n } = useTranslation();
  const [intent, setIntent] = useState(null); // { clientSecret, amount }
  const [error, setError] = useState(null);

  const requestId = request?.id;

  useEffect(() => {
    if (!requestId) return;
    if (!STRIPE_KEY) {
      setError(t("payment.notConfigured"));
      return;
    }
    let alive = true;
    setIntent(null);
    setError(null);
    requestsApi
      .startPayment(requestId)
      .then((res) => alive && setIntent({ clientSecret: res.client_secret, amount: res.payment?.amount_usd }))
      .catch((err) => alive && setError(errorMessage(err, t)));
    return () => {
      alive = false;
    };
  }, [requestId, t]);

  const options = useMemo(
    () =>
      intent && {
        clientSecret: intent.clientSecret,
        appearance: stripeAppearance(),
        locale: i18n.language === "ar" ? "ar" : "en",
        fonts: FONTS,
      },
    // the Payment Element can't change its client secret after mounting, so only rebuild on a new intent
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intent?.clientSecret],
  );

  if (!request) return null;

  return (
    <Modal open onClose={onClose} title={t("payment.title")} description={t("payment.lead")}>
      {intent?.amount != null && (
        <div className="sh-pay__amount">
          <span>{t("payment.amount")}</span>
          <strong>{formatMoney(intent.amount)}</strong>
        </div>
      )}

      {error ? (
        <>
          <div className="sh-alert" role="alert"><AlertCircle size={16} /> {error}</div>
          <div className="sh-modal__actions">
            <button type="button" className="sh-btn sh-btn--ghost" onClick={onClose}>{t("common.close")}</button>
          </div>
        </>
      ) : !options ? (
        <div className="sh-pay__loading" aria-busy="true">
          <span className="sh-skeleton" style={{ height: 44 }} />
          <span className="sh-skeleton" style={{ height: 44 }} />
          <span className="sh-skeleton" style={{ height: 44, width: "60%" }} />
        </div>
      ) : (
        <Elements stripe={getStripe()} options={options} key={options.locale}>
          <CardForm requestId={request.id} onClose={onClose} onHeld={onHeld} />
        </Elements>
      )}
    </Modal>
  );
}

function CardForm({ requestId, onClose, onHeld }) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message || t("payment.failed"));
        return;
      }
      if (paymentIntent?.status !== "requires_capture") {
        setError(t("payment.notHeld", { status: paymentIntent?.status }));
        return;
      }

      await requestsApi.confirmPayment(requestId);
      onHeld();
    } catch (err) {
      setError(errorMessage(err, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="sh-pay">
      <PaymentElement onReady={() => setReady(true)} options={{ layout: "tabs" }} />

      {STRIPE_TEST_MODE && (
        <p className="sh-pay__test">
          {t("payment.testHint")} <bdi dir="ltr">4242 4242 4242 4242</bdi>
        </p>
      )}

      {error && <div className="sh-alert" role="alert"><AlertCircle size={16} /> {error}</div>}

      <p className="sh-pay__note"><ShieldCheck size={15} /> {t("requests.holdHint")}</p>

      <div className="sh-modal__actions">
        <button type="button" className="sh-btn sh-btn--ghost" onClick={onClose} disabled={submitting}>
          {t("common.cancel")}
        </button>
        <button type="submit" className="sh-btn sh-btn--primary" disabled={!stripe || !ready || submitting}>
          <Lock size={15} /> {submitting ? t("payment.processing") : t("payment.submit")}
        </button>
      </div>
    </form>
  );
}
