"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import { type User, dummyUser } from "../data/users"

interface AuthContextType {
    user: User | null
    login: (provider: "google" | "kakao") => Promise<void>
    logout: () => void
    updatePreferences: (preferences: string[]) => void
    addToFavorites: (companyId: number) => void
    removeFromFavorites: (companyId: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(dummyUser) // 개발용으로 기본 로그인 상태

    const login = async (provider: "google" | "kakao") => {
        // OAuth 로그인 처리 - API 연동필요
        console.log(`${provider} 로그인 시도`)

        try {
            // 실제로는 백엔드 OAuth 엔드포인트 호출
            // const response = await fetch(`/auth/login/${provider}`);

            // 더미 로그인 처리
            setUser(dummyUser)
        } catch (error) {
            console.error("로그인 실패:", error)
        }
    }

    const logout = () => {
        // 로그아웃 처리 - API 연동필요
        setUser(null)
    }

    const updatePreferences = (preferences: string[]) => {
        if (user) {
            // DB연결 필요 - PUT /user/preferences
            setUser({ ...user, preferences })
        }
    }

    const addToFavorites = (companyId: number) => {
        if (user && !user.favorites.includes(companyId)) {
            // DB연결 필요 - POST /favorites
            setUser({ ...user, favorites: [...user.favorites, companyId] })
        }
    }

    const removeFromFavorites = (companyId: number) => {
        if (user) {
            // DB연결 필요 - DELETE /favorites/{companyId}
            setUser({ ...user, favorites: user.favorites.filter((id) => id !== companyId) })
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                updatePreferences,
                addToFavorites,
                removeFromFavorites,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
