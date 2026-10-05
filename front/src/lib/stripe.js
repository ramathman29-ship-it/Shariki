import { loadStripe } from "@stripe/stripe-js";

export const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY || "";
export const STRIPE_TEST_MODE = STRIPE_KEY.startsWith("pk_test_");

let stripePromise = null;

/** Loads Stripe.js once, on first use. Resolves to null when no publishable key is configured. */
export function getStripe() {
  if (!STRIPE_KEY) return Promise.resolve(null);
  stripePromise ??= loadStripe(STRIPE_KEY);
  return stripePromise;
}

/** Payment Element styling that follows the site's design tokens. */
export function stripeAppearance() {
  const css = getComputedStyle(document.documentElement);
  const token = (name, fallback) => css.getPropertyValue(name).trim() || fallback;

  return {
    theme: "stripe",
    variables: {
      colorPrimary: token("--sh-accent", "#9a5b34"),
      colorBackground: token("--sh-surface", "#ffffff"),
      colorText: token("--sh-ink", "#1c1a17"),
      colorTextSecondary: token("--sh-muted", "#6e675e"),
      colorDanger: token("--sh-red", "#b4452f"),
      borderRadius: token("--sh-radius-sm", "10px"),
      fontFamily: token("--sh-font", "system-ui, sans-serif"),
    },
  };
}
