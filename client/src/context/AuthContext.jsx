import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setAccessToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  
    const [user, setUser] = useState(null);
  
    const [loading, setLoading] = useState(true); // true until bootstrap finishes

    useEffect(() => {
        let cancelled = false;
        async function bootstrap() {
            try {
                const { data } = await api.post("/auth/refresh");
                if (cancelled) return;
                setAccessToken(data.accessToken);
                setUser(data.user);
            } catch {
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        bootstrap();
        return () => {
            cancelled = true;
        };
    }, []);

    const signup = useCallback(async (payload) => {
        const { data } = await api.post("/auth/sign-up", payload);
        setAccessToken(data.accessToken);
        setUser(data.user);
    }, []);

    const login = useCallback(async (payload) => {
        const { data } = await api.post("/auth/sign-in", payload);
        setAccessToken(data.accessToken);
        setUser(data.user);
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
