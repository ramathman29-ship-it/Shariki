import demoProperties from "@/data/demoProperties.json";
import { api } from "./client";

const normalise = (p) => ({ ...p, suffixes: p.suffixes || [], photos: (p.photos || []).filter(Boolean) });

export const propertiesApi = {
  /**
   * Approved listings. Falls back to the bundled demo data when the API is
   * down or still empty, so the public site is never blank.
   * @returns {Promise<{ properties: object[], demo: boolean }>}
   */
  list: async () => {
    try {
      const data = await api.get("/propertiesall");
      if (data.properties?.length) return { properties: data.properties.map(normalise), demo: false };
    } catch {
      // fall through to demo data
    }
    return { properties: demoProperties.map(normalise), demo: true };
  },

  /** @returns {Promise<{ property: object | null, demo: boolean }>} */
  get: async (id) => {
    try {
      const data = await api.get(`/propertiesall/${id}`);
      const p = data.property || data;
      if (p?.id) return { property: normalise(p), demo: false };
    } catch {
      // fall through to demo data
    }
    const p = demoProperties.find((x) => String(x.id) === String(id));
    return { property: p ? normalise(p) : null, demo: true };
  },

  mine: async () => (await api.get("/propertiesforuser")).properties?.map(normalise) || [],
  create: (formData) => api.post("/properties", formData),
  remove: (id) => api.delete(`/properties/${id}`),

  // admin
  pending: async () => (await api.get("/properties")).properties?.map(normalise) || [],
  approve: (id) => api.post(`/admin/properties/${id}/approve`),
  reject: (id) => api.post(`/admin/properties/${id}/notapprove`),
};
