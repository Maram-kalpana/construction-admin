import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const STORAGE_KEY = "erp_auth";
const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(STORAGE_KEY);
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        setUser(parsedUser);
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  const login = useCallback((authUser) => {
    if (!authUser) return false;

    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    localStorage.setItem(TOKEN_KEY, "erp-token");
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(() => {
    return {
      user,
      setUser,
      login,
      logout,
      ready,
      isAuthenticated: !!user,
    };
  }, [user, login, logout, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}