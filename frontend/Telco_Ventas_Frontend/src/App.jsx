import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AgentePage from './pages/AgentePage'
import BackofficePage from './pages/BackofficePage'
import SupervisorPage from './pages/SupervisorPage'
import Layout from './components/Layout'

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.rol)) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  const getRoleHome = () => {
    if (!user) return '/login'
    switch (user.rol) {
      case 'AGENTE': return '/agente'
      case 'BACKOFFICE': return '/backoffice'
      case 'SUPERVISOR': return '/supervisor'
      default: return '/login'
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to={getRoleHome()} replace />} />
      <Route path="/agente" element={
        <PrivateRoute roles={['AGENTE']}>
          <Layout><AgentePage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/backoffice" element={
        <PrivateRoute roles={['BACKOFFICE']}>
          <Layout><BackofficePage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/supervisor" element={
        <PrivateRoute roles={['SUPERVISOR']}>
          <Layout><SupervisorPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
