import React, { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const ESTADO_COLORS = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  APROBADA: 'bg-green-100 text-green-800',
  RECHAZADA: 'bg-red-100 text-red-800',
}

const initialForm = {
  dniCliente: '', nombreCliente: '', telefonoCliente: '', direccionCliente: '',
  planActual: '', planNuevo: '', codigoLlamada: '', producto: 'FIJA_HOGAR', monto: '',
}

export default function AgentePage() {
  const [ventas, setVentas] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState({ estado: '', desde: '', hasta: '' })

  const fetchVentas = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size: 10 }
      if (filter.estado) params.estado = filter.estado
      if (filter.desde) params.desde = filter.desde + 'T00:00:00'
      if (filter.hasta) params.hasta = filter.hasta + 'T23:59:59'
      const res = await api.get('/ventas/mis-ventas', { params })
      setVentas(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch {
      toast.error('Error al cargar ventas')
    } finally {
      setLoading(false)
    }
  }, [page, filter])

  useEffect(() => { fetchVentas() }, [fetchVentas])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/ventas', { ...form, monto: parseFloat(form.monto) })
      toast.success('Venta registrada exitosamente')
      setForm(initialForm)
      setShowForm(false)
      fetchVentas()
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.fields
        ? Object.values(err.response.data.fields || {}).join(', ')
        : 'Error al registrar venta'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Ventas</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona y registra tus ventas de Telco Fija Hogar</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? '✕ Cancelar' : '+ Nueva Venta'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Registrar Nueva Venta</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'dniCliente', label: 'DNI Cliente', placeholder: '12345678' },
              { key: 'nombreCliente', label: 'Nombre Completo', placeholder: 'Juan Pérez García' },
              { key: 'telefonoCliente', label: 'Teléfono', placeholder: '987654321' },
              { key: 'codigoLlamada', label: 'Código Llamada', placeholder: 'CALL-2024-001' },
              { key: 'planActual', label: 'Plan Actual', placeholder: 'Sin plan / Plan Basic' },
              { key: 'planNuevo', label: 'Plan Nuevo', placeholder: 'Plan Pro 200Mbps' },
              { key: 'monto', label: 'Monto (S/)', placeholder: '89.90', type: 'number' },
            ].map(({ key, label, placeholder, type = 'text' }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  step={type === 'number' ? '0.01' : undefined}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Dirección</label>
              <input
                type="text"
                value={form.direccionCliente}
                onChange={e => setForm({ ...form, direccionCliente: e.target.value })}
                placeholder="Av. Arequipa 1234, Lima"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" disabled={submitting}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
                {submitting ? 'Registrando...' : 'Registrar Venta'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Estado</label>
          <select value={filter.estado} onChange={e => setFilter({...filter, estado: e.target.value})}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APROBADA">Aprobada</option>
            <option value="RECHAZADA">Rechazada</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Desde</label>
          <input type="date" value={filter.desde} onChange={e => setFilter({...filter, desde: e.target.value})}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
          <input type="date" value={filter.hasta} onChange={e => setFilter({...filter, hasta: e.target.value})}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button onClick={() => { setFilter({ estado: '', desde: '', hasta: '' }); setPage(0) }}
          className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
          Limpiar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : ventas.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay ventas registradas</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Código', 'Cliente', 'DNI', 'Plan Nuevo', 'Monto', 'Estado', 'Fecha'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ventas.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{v.codigoLlamada}</td>
                    <td className="px-4 py-3 font-medium">{v.nombreCliente}</td>
                    <td className="px-4 py-3 text-gray-600">{v.dniCliente}</td>
                    <td className="px-4 py-3 text-gray-600">{v.planNuevo}</td>
                    <td className="px-4 py-3 font-medium text-indigo-600">S/ {parseFloat(v.monto).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLORS[v.estado]}`}>
                        {v.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(v.fechaRegistro).toLocaleDateString('es-PE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500">Página {page + 1} de {totalPages}</span>
            <div className="flex space-x-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 text-xs border rounded disabled:opacity-40 hover:bg-gray-50">← Ant</button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-xs border rounded disabled:opacity-40 hover:bg-gray-50">Sig →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
