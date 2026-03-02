import React, { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const ESTADO_COLORS = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  APROBADA: 'bg-green-100 text-green-800',
  RECHAZADA: 'bg-red-100 text-red-800',
}

export default function SupervisorPage() {
  const [tab, setTab] = useState('equipo')
  const [ventas, setVentas] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [resumen, setResumen] = useState(null)
  const [filter, setFilter] = useState({ estado: '', agenteId: '', desde: '', hasta: '' })
  const [resumePeriodo, setResumePeriodo] = useState('MES')

  const fetchEquipo = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size: 10 }
      if (filter.estado) params.estado = filter.estado
      if (filter.agenteId) params.agenteId = filter.agenteId
      if (filter.desde) params.desde = filter.desde + 'T00:00:00'
      if (filter.hasta) params.hasta = filter.hasta + 'T23:59:59'
      const res = await api.get('/ventas/equipo', { params })
      setVentas(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch {
      toast.error('Error al cargar ventas del equipo')
    } finally {
      setLoading(false)
    }
  }, [page, filter])

  const fetchResumen = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/reportes/resumen', { params: { periodo: resumePeriodo } })
      setResumen(res.data)
    } catch {
      toast.error('Error al cargar resumen')
    } finally {
      setLoading(false)
    }
  }, [resumePeriodo])

  useEffect(() => {
    if (tab === 'equipo') fetchEquipo()
    else fetchResumen()
  }, [tab, fetchEquipo, fetchResumen])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Panel Supervisor</h2>
        <p className="text-gray-500 text-sm mt-1">Monitorea el rendimiento de tu equipo</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'equipo', label: '👥 Ventas del Equipo' },
            { key: 'resumen', label: '📊 Resumen / Reporte' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'equipo' && (
        <>
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
              <label className="block text-xs text-gray-500 mb-1">ID Agente</label>
              <input type="number" value={filter.agenteId}
                onChange={e => setFilter({...filter, agenteId: e.target.value})}
                placeholder="Ej: 3"
                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Desde</label>
              <input type="date" value={filter.desde}
                onChange={e => setFilter({...filter, desde: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hasta</label>
              <input type="date" value={filter.hasta}
                onChange={e => setFilter({...filter, hasta: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button onClick={() => setFilter({ estado: '', agenteId: '', desde: '', hasta: '' })}
              className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
              Limpiar
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-gray-400">Cargando...</div>
            ) : ventas.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No hay ventas para los filtros seleccionados</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Código', 'Agente', 'Cliente', 'Plan Nuevo', 'Monto', 'Estado', 'Fecha Reg.', 'Fecha Val.'].map(h => (
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
                        <td className="px-4 py-3 text-gray-600">{v.planNuevo}</td>
                        <td className="px-4 py-3 font-semibold text-indigo-600">S/ {parseFloat(v.monto).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLORS[v.estado]}`}>
                            {v.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(v.fechaRegistro).toLocaleDateString('es-PE')}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {v.fechaValidacion ? new Date(v.fechaValidacion).toLocaleDateString('es-PE') : '—'}
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
        </>
      )}

      {tab === 'resumen' && (
        <div className="space-y-6">
          {/* Periodo selector */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Período:</span>
            {['DIA', 'MES'].map(p => (
              <button key={p} onClick={() => setResumePeriodo(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  resumePeriodo === p
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}>
                {p === 'DIA' ? 'Hoy' : 'Este Mes'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Cargando resumen...</div>
          ) : resumen && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Ventas', value: resumen.totalVentas, color: 'text-gray-900' },
                  { label: 'Pendientes', value: resumen.pendientes, color: 'text-yellow-600' },
                  { label: 'Aprobadas', value: resumen.aprobadas, color: 'text-green-600' },
                  { label: 'Rechazadas', value: resumen.rechazadas, color: 'text-red-600' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</div>
                    <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Monto Total Aprobado</div>
                <div className="text-3xl font-bold text-indigo-600">
                  S/ {parseFloat(resumen.montoTotalAprobadas || 0).toFixed(2)}
                </div>
              </div>

              {/* Serie por día */}
              {resumen.ventasPorDia && resumen.ventasPorDia.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Ventas por Día</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="pb-2 text-left text-xs text-gray-500 font-medium">Fecha</th>
                          <th className="pb-2 text-right text-xs text-gray-500 font-medium">Cantidad</th>
                          <th className="pb-2 text-right text-xs text-gray-500 font-medium">Monto Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {resumen.ventasPorDia.map(d => (
                          <tr key={d.fecha}>
                            <td className="py-2 font-mono text-xs text-gray-700">{d.fecha}</td>
                            <td className="py-2 text-right font-medium">{d.cantidad}</td>
                            <td className="py-2 text-right text-indigo-600 font-medium">
                              S/ {parseFloat(d.monto).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
