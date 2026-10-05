import { createContext } from "react";

/** @type {React.Context<{ user: object|null, isLoggedIn: boolean, isAdmin: boolean, loading: boolean, login: Function, logout: Function, refresh: Function }>} */
export const AuthContext = createContext(null);

/** @type {React.Context<{ success: (msg: string) => void, error: (msg: string) => void }>} */
export const ToastContext = createContext(null);
