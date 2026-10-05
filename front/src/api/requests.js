import { api } from "./client";

export const requestsApi = {
  /** @returns {Promise<{ sent: object[], received: object[] }>} */
  mine: async () => {
    const data = await api.get("/user/requests");
    return { sent: data.sent_requests || [], received: data.received_requests || [] };
  },
  create: ({ propertyId, message, rate }) =>
    api.post("/user/requests", { prp_id: propertyId, description: message, rate }),
  cancel: (id) => api.delete(`/user/requests/${id}/cancel`),
  decide: (id, status) => api.put(`/user/requests/${id}/status`, { status }), // accepted | rejected
  /** Step 1: creates (or reuses) the Stripe PaymentIntent. @returns {Promise<{ client_secret: string, payment: object }>} */
  startPayment: (id) => api.post(`/user/requests/${id}/payment`),
  /** Step 2: after Stripe.js confirmed the card, the backend checks the hold and marks the request "held". */
  confirmPayment: (id) => api.post(`/user/requests/${id}/payment/confirm`),
  releasePayment: (id) => api.post(`/user/requests/${id}/rejected`),
  myShares: async () => (await api.get("/user/myShares")).shares || [],

  // admin
  accepted: async () => (await api.get("/admin/requests")).data || [],
  uploadContract: (id, file) => {
    const form = new FormData();
    form.append("contract", file);
    return api.post(`/admin/requests/${id}/contract`, form);
  },
};
