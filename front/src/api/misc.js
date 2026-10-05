import { api } from "./client";

export const notificationsApi = {
  list: async () => {
    const data = await api.get("/notifications");
    return { items: data.data || [], unread: data.unread_count || 0 };
  },
};

export const reportsApi = {
  /** @param {"daily" | "monthly"} type */
  get: async (type) => (await api.post(`/admin/reports/${type}`)).report,
};
