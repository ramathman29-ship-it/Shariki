import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { authApi } from "@/api";
import { session } from "@/lib/session";
import { AuthContext } from "./contexts";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => session.getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!session.getToken());
  const skipFetch = useRef(false); // login() already loaded the profile

  const reset = useCallback(() => {
    session.clear();
    setToken(null);
    setUser(null);
  }, []);

  // Load the profile whenever the token changes
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (skipFetch.current) {
      skipFetch.current = false;
      return;
    }
    let active = true;
    setLoading(true);
    authApi
      .profile()
      .then((profile) => active && setUser(profile))
      .catch((err) => active && err.status === 401 && reset())
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token, reset]);

  // The API client fires this on any 401
  useEffect(() => {
    window.addEventListener("auth:expired", reset);
    return () => window.removeEventListener("auth:expired", reset);
  }, [reset]);

  const login = useCallback(async (email, password) => {
    const newToken = await authApi.login(email, password);
    session.setToken(newToken);
    const profile = await authApi.profile();
    skipFetch.current = true;
    setUser(profile);
    setToken(newToken);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // token may already be invalid; clear locally anyway
    }
    reset();
  }, [reset]);

  const refresh = useCallback(async () => setUser(await authApi.profile()), []);

  const value = useMemo(
    () => ({ user, isLoggedIn: !!token, isAdmin: !!user?.is_admin, loading, login, logout, refresh }),
    [user, token, loading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
