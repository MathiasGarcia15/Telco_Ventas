import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(username, password)
      toast.success(`Bienvenido, ${user.username}`)
      switch (user.rol) {
        case 'AGENTE': navigate('/agente'); break
        case 'BACKOFFICE': navigate('/backoffice'); break
        case 'SUPERVISOR': navigate('/supervisor'); break
        default: navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-700 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-indigo-700">T</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Telco Ventas</h2>
            <p className="text-indigo-200 text-sm mt-1">Sistema de Ventas Fija Hogar</p>
          </div>
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="agente1, back1, supervisor1..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Cuentas de prueba</p>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between"><span className="font-mono">agente1</span><span>Agente*123</span></div>
                <div className="flex justify-between"><span className="font-mono">back1</span><span>Back*123</span></div>
                <div className="flex justify-between"><span className="font-mono">supervisor1</span><span>Sup*123</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
