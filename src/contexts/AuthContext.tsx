"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../data/users";
import { fetchMe, updateUserPreferences, addFavorite, removeFavorite } from "../data/users";

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (provider: "google" | "kakao") => Promise<void>
    logout: () => void
    updatePreferences: (preferences: string[]) => void
    addToFavorites: (companyId: number) => void
    removeFromFavorites: (companyId: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = process.env.REACT_APP_DBAPI_URL as string;

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("AuthProvider 내부에서만 사용하세요");
    return ctx;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const finish = () => setLoading(false);

        if (token) {
            localStorage.setItem("token", token);
            window.history.replaceState({}, "", window.location.pathname);
            fetchMe(token)
                .then(setUser)
                .catch(() => localStorage.removeItem("token"))
                .finally(() => {
                    finish();
                    navigate("/", { replace: true });
                });
        } else {
            const stored = localStorage.getItem("token");
            if (stored) {
                fetchMe(stored)
                    .then(setUser)
                    .catch(() => localStorage.removeItem("token"))
                    .finally(finish);
            } else {
                finish();
            }
        }
    }, [navigate]);

    const login = async (provider: "google" | "kakao") => {
        window.location.href = `${API_URL}/auth/login/${provider}`;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login", { replace: true });
    };

    const updatePreferences = async (prefs: string[]) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("로그인이 필요합니다");
        const updated = await updateUserPreferences(token, prefs);
        setUser(updated);
    };

    const addToFavorites = async (companyId: number) => {
        if (!user) return;
        const token = localStorage.getItem("token");
        if (!token) throw new Error("로그인이 필요합니다");
        const updated = await addFavorite(token, companyId);
        setUser(updated);
    };

    const removeFromFavorites = async (companyId: number) => {
        if (!user) return;
        const token = localStorage.getItem("token");
        if (!token) throw new Error("로그인이 필요합니다");
        const updated = await removeFavorite(token, companyId);
        setUser(updated);
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, updatePreferences, addToFavorites, removeFromFavorites, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
