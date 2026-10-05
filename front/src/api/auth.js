import { api } from "./client";

export const authApi = {
  /** @returns {Promise<string>} the bearer token */
  login: async (email, password) => {
    const data = await api.post("/login", { email, password });
    const token = data.token || data.Token; // admin and user responses differ
    if (!token) throw new Error("No token received");
    return token;
  },
  register: (payload) => api.post("/register", payload),
  logout: () => api.get("/logout"),
  profile: () => api.get("/user/profile"),
};
