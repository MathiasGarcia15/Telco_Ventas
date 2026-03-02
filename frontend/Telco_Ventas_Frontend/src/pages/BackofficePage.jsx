import React, { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function BackofficePage() {
  const [ventas, setVentas] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [rejectModal, setRejectModal] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [processing, setProcessing] = useState(null)

  const fetchVentas = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/ventas/pendientes', { params: { page, size: 10 } })
      setVentas(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch {
      toast.error('Error al cargar ventas pendientes')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchVentas() }, [fetchVentas])

  const handleAprobar = async (id) => {
    setProcessing(id)
    try {
      await api.post(`/ventas/${id}/aprobar`)
      toast.success('Venta aprobada')
      fetchVentas()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al aprobar')
    } finally {
      setProcessing(null)
    }
  }

  const handleRechazar = async () => {
    if (!motivo.trim()) { toast.error('Ingresa el motivo de rechazo'); return }
    setProcessing(rejectModal)
    try {
      await api.post(`/ventas/${rejectModal}/rechazar`, { motivoRechazo: motivo })
      toast.success('Venta rechazada')
      setRejectModal(null)
      setMotivo('')
      fetchVentas()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al rechazar')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Validación de Ventas</h2>
        <p className="text-gray-500 text-sm mt-1">Aprueba o rechaza las ventas pendientes</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : ventas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-gray-500 font-medium">No hay ventas pendientes</p>
            <p className="text-gray-400 text-sm">Todas las ventas han sido procesadas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Código', 'Agente', 'Cliente', 'DNI', 'Plan', 'Monto', 'Fecha', 'Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ventas.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{v.codigoLlamada}</td>
                    <td className="px-4 py-3 text-gray-600">{v.agenteUsername}</td>
                    <td className="px-4 py-3 font-medium">{v.nombreCliente}</td>
                    <td className="px-4 py-3 text-gray-600">{v.dniCliente}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <div className="text-gray-400">{v.planActual}</div>
                        <div className="font-medium text-gray-700">→ {v.planNuevo}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">S/ {parseFloat(v.monto).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(v.fechaRegistro).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAprobar(v.id)}
                          disabled={processing === v.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50 transition-colors"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => { setRejectModal(v.id); setMotivo('') }}
                          disabled={processing === v.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50 transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
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

      {/* Modal Rechazo */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Rechazar Venta</h3>
            <p className="text-sm text-gray-500 mb-4">Ingresa el motivo del rechazo (obligatorio)</p>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              rows={3}
              placeholder="Ej: Cliente ya tiene contrato vigente..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setRejectModal(null)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleRechazar} disabled={!!processing}
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50">
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
