// Persists the auth token. The rest of the app reads it through AuthProvider.
const TOKEN_KEY = "token";

export const session = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("role"); // legacy key from the old login page
  },
};
