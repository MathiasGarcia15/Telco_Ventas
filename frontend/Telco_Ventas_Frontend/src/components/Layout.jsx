import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const rolLabels = {
  AGENTE: 'Agente',
  BACKOFFICE: 'Backoffice',
  SUPERVISOR: 'Supervisor',
  ADMIN: 'Administrador',
}

const rolColors = {
  AGENTE: 'bg-blue-100 text-blue-800',
  BACKOFFICE: 'bg-purple-100 text-purple-800',
  SUPERVISOR: 'bg-green-100 text-green-800',
  ADMIN: 'bg-red-100 text-red-800',
}

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-indigo-700 font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Telco Ventas</h1>
            <span className="text-indigo-300 text-sm hidden sm:block">| Fija Hogar</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user?.username}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rolColors[user?.rol] || ''}`}>
                {rolLabels[user?.rol] || user?.rol}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="text-center text-xs text-gray-400 py-4 border-t">
        Telco Ventas © 2024 — Sistema de Gestión de Ventas Fija Hogar
      </footer>
    </div>
  )
}
