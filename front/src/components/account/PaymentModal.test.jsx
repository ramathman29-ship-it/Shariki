import { useEffect } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "@/api/client";
import PaymentModal from "./PaymentModal";

const h = vi.hoisted(() => ({
  stripeKey: "pk_test_dummy",
  confirmStripe: vi.fn(),
  startPayment: vi.fn(),
  confirmPayment: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  get STRIPE_KEY() {
    return h.stripeKey;
  },
  get STRIPE_TEST_MODE() {
    return h.stripeKey.startsWith("pk_test_");
  },
  getStripe: () => Promise.resolve({}),
  stripeAppearance: () => ({}),
}));

// Stripe's iframe can't run in jsdom: stand in for the Payment Element and stripe.confirmPayment
vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }) => children,
  PaymentElement: ({ onReady }) => {
    useEffect(() => onReady?.(), [onReady]);
    return <div data-testid="payment-element" />;
  },
  useStripe: () => ({ confirmPayment: h.confirmStripe }),
  useElements: () => ({}),
}));

vi.mock("@/api", async (importOriginal) => ({
  ...(await importOriginal()),
  requestsApi: { startPayment: h.startPayment, confirmPayment: h.confirmPayment },
}));

const request = { id: 7, status: "accepted", payment_status: "pending" };

function setup(props = {}) {
  const onHeld = vi.fn();
  const onClose = vi.fn();
  render(<PaymentModal request={request} onHeld={onHeld} onClose={onClose} {...props} />);
  return { onHeld, onClose, user: userEvent.setup() };
}

const submitButton = () => screen.findByRole("button", { name: /hold amount/i });

beforeEach(() => {
  h.stripeKey = "pk_test_dummy";
  vi.clearAllMocks();
  h.startPayment.mockResolvedValue({ success: true, client_secret: "pi_1_secret_x", payment: { amount_usd: 30000 } });
  h.confirmPayment.mockResolvedValue({ success: true, payment_status: "held" });
});

describe("PaymentModal", () => {
  it("asks the backend for a PaymentIntent and shows the amount and card form", async () => {
    setup();

    expect(await screen.findByTestId("payment-element")).toBeInTheDocument();
    expect(h.startPayment).toHaveBeenCalledWith(7);
    expect(screen.getByText("$30,000")).toBeInTheDocument();
    expect(screen.getByText(/4242 4242 4242 4242/)).toBeInTheDocument(); // test-mode hint
    expect(await submitButton()).toBeEnabled();
  });

  it("holds the amount: confirms with Stripe, then tells the backend", async () => {
    h.confirmStripe.mockResolvedValue({ paymentIntent: { status: "requires_capture" } });
    const { onHeld, user } = setup();

    await user.click(await submitButton());

    await waitFor(() => expect(onHeld).toHaveBeenCalledTimes(1));
    expect(h.confirmStripe).toHaveBeenCalledWith(expect.objectContaining({ redirect: "if_required" }));
    expect(h.confirmPayment).toHaveBeenCalledWith(7);
  });

  it("shows Stripe's card error and does not mark the request held", async () => {
    h.confirmStripe.mockResolvedValue({ error: { message: "Your card was declined." } });
    const { onHeld, user } = setup();

    await user.click(await submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent("Your card was declined.");
    expect(h.confirmPayment).not.toHaveBeenCalled();
    expect(onHeld).not.toHaveBeenCalled();
    expect(await submitButton()).toBeEnabled(); // can retry
  });

  it("refuses a PaymentIntent that wasn't put on hold", async () => {
    h.confirmStripe.mockResolvedValue({ paymentIntent: { status: "succeeded" } });
    const { onHeld, user } = setup();

    await user.click(await submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(/succeeded/);
    expect(h.confirmPayment).not.toHaveBeenCalled();
    expect(onHeld).not.toHaveBeenCalled();
  });

  it("shows the backend error when the payment can't be started", async () => {
    h.startPayment.mockRejectedValue(new ApiError("Request is not accepted yet", { status: 400 }));
    setup();

    expect(await screen.findByRole("alert")).toHaveTextContent("Request is not accepted yet");
    expect(screen.queryByTestId("payment-element")).not.toBeInTheDocument();
  });

  it("explains the missing key instead of calling the backend", async () => {
    h.stripeKey = "";
    setup();

    expect(await screen.findByRole("alert")).toHaveTextContent(/VITE_STRIPE_KEY/);
    expect(h.startPayment).not.toHaveBeenCalled();
  });

  it("closes from the cancel button", async () => {
    const { onClose, user } = setup();

    await user.click(await screen.findByRole("button", { name: /^cancel$/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
