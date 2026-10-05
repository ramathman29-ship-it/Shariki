// Single source of truth for URLs. Use these instead of string literals.
export const ROUTES = {
  home: "/",
  properties: "/properties",
  property: (id) => `/properties/${id}`,
  about: "/about",
  login: "/login",
  listProperty: "/list-property",
  account: {
    requests: "/account/requests",
    properties: "/account/properties",
    profile: "/account/profile",
  },
  admin: {
    root: "/admin",
    listings: "/admin/listings",
    contracts: "/admin/contracts",
    reports: "/admin/reports",
  },
};

/** Properties page URL with filters, e.g. propertiesUrl({ deal: "rent" }) */
export function propertiesUrl(filters = {}) {
  const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
  const qs = params.toString();
  return qs ? `${ROUTES.properties}?${qs}` : ROUTES.properties;
}
