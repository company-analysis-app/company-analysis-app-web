"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import CompanyDetailPage from "./pages/CompanyDetailPage"
import ProfilePage from "./pages/ProfilePage"
import CompanySearchPage from "./pages/CompanySearchPage"
import NavBar from "./components/Navbar"

// 보호된 라우트 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// 레이아웃 컴포넌트 (네비게이션 바 포함)
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <NavBar />}
      {children}
    </div>
  )
}

const AppContent: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 보호된 라우트들 */}
        <Route path="/" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute> <CompanySearchPage /> </ProtectedRoute>} />
        <Route path="/company/:companyName" element={<ProtectedRoute> <CompanyDetailPage /> </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />

        {/* 404 페이지 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
