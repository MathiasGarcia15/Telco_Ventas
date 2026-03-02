package com.pruebatecnica.telco.service;

import com.pruebatecnica.telco.dto.request.VentaRequest;
import com.pruebatecnica.telco.dto.response.VentaResponse;
import com.pruebatecnica.telco.entity.Usuario;
import com.pruebatecnica.telco.entity.Venta;
import com.pruebatecnica.telco.enums.Estado;
import com.pruebatecnica.telco.exception.BusinessException;
import com.pruebatecnica.telco.exception.ResourceNotFoundException;
import com.pruebatecnica.telco.mapper.VentaMapper;
import com.pruebatecnica.telco.repository.UsuarioRepository;
import com.pruebatecnica.telco.repository.VentaRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaService {
    private final VentaRepository ventaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VentaMapper ventaMapper;

    // Este es el tramite del agente

    @Transactional
    public VentaResponse.Detalle crearVenta(VentaRequest.CrearVenta request, String username) {
        Usuario agente = getUsuarioByUsername(username);

        if (ventaRepository.existsByCodigoLlamada(request.getCodigoLlamada())) {
            throw new BusinessException("El código de llamada '" + request.getCodigoLlamada() + "' ya existe");
        }

        Venta venta = Venta.builder()
                .agente(agente)
                .dniCliente(request.getDniCliente())
                .nombreCliente(request.getNombreCliente())
                .telefonoCliente(request.getTelefonoCliente())
                .direccionCliente(request.getDireccionCliente())
                .planActual(request.getPlanActual())
                .planNuevo(request.getPlanNuevo())
                .codigoLlamada(request.getCodigoLlamada())
                .producto(request.getProducto() != null ? request.getProducto() : "FIJA_HOGAR")
                .monto(request.getMonto())
                .estado(Estado.PENDIENTE)
                .fechaRegistro(LocalDateTime.now())
                .build();

        return ventaMapper.toDetalle(ventaRepository.save(venta));
    }

    @Transactional(readOnly = true)
    public Page<VentaResponse.Detalle> getMisVentas(String username, Estado estado,
                                                    LocalDateTime desde, LocalDateTime hasta,
                                                    int page, int size, String sortBy, String direction) {
        Usuario agente = getUsuarioByUsername(username);
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ventaRepository.findByAgenteWithFilters(agente.getId(), estado, desde, hasta, pageable)
                .map(ventaMapper::toDetalle);
    }

    // Chamba del BACKOFFICE para aprobar/rechazar

    @Transactional(readOnly = true)
    public Page<VentaResponse.Detalle> getPendientes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaRegistro").ascending());
        return ventaRepository.findByEstado(Estado.PENDIENTE, pageable)
                .map(ventaMapper::toDetalle);
    }

    @Transactional
    public VentaResponse.Detalle aprobarVenta(Long id) {
        Venta venta = getVentaPendiente(id);
        venta.setEstado(Estado.APROBADA);
        venta.setFechaValidacion(LocalDateTime.now());
        return ventaMapper.toDetalle(ventaRepository.save(venta));
    }

    @Transactional
    public VentaResponse.Detalle rechazarVenta(Long id, VentaRequest.RechazarVenta request) {
        Venta venta = getVentaPendiente(id);
        venta.setEstado(Estado.RECHAZADA);
        venta.setMotivoRechazo(request.getMotivoRechazo());
        venta.setFechaValidacion(LocalDateTime.now());
        return ventaMapper.toDetalle(ventaRepository.save(venta));
    }

    // Revision del supervisor al trabajo de los agentes

    @Transactional(readOnly = true)
    public Page<VentaResponse.Detalle> getVentasEquipo(String username, Estado estado,
                                                       Long agenteId, LocalDateTime desde,
                                                       LocalDateTime hasta, int page, int size) {
        Usuario supervisor = getUsuarioByUsername(username);
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaRegistro").descending());
        return ventaRepository.findByEquipoWithFilters(supervisor.getId(), estado, agenteId, desde, hasta, pageable)
                .map(ventaMapper::toDetalle);
    }

    @Transactional(readOnly = true)
    public VentaResponse.Resumen getResumen(String username, LocalDateTime desde, LocalDateTime hasta) {
        Usuario supervisor = getUsuarioByUsername(username);

        List<Object[]> conteos = ventaRepository.countByEstadoForSupervisor(supervisor.getId(), desde, hasta);
        List<Object[]> serie = ventaRepository.ventasPorDiaForSupervisor(supervisor.getId(), desde, hasta);

        long pendientes = 0, aprobadas = 0, rechazadas = 0;
        BigDecimal montoAprobadas = BigDecimal.ZERO;

        for (Object[] row : conteos) {
            Estado estado = Estado.valueOf(row[0].toString());
            long count = ((Number) row[1]).longValue();
            BigDecimal monto = new BigDecimal(row[2].toString());
            switch (estado) {
                case PENDIENTE -> pendientes = count;
                case APROBADA -> { aprobadas = count; montoAprobadas = monto; }
                case RECHAZADA -> rechazadas = count;
            }
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<VentaResponse.VentaDia> ventasPorDia = new ArrayList<>();
        for (Object[] row : serie) {
            ventasPorDia.add(VentaResponse.VentaDia.builder()
                    .fecha(row[0].toString())
                    .cantidad(((Number) row[1]).longValue())
                    .monto(new BigDecimal(row[2].toString()))
                    .build());
        }

        return VentaResponse.Resumen.builder()
                .desde(desde)
                .hasta(hasta)
                .totalVentas(pendientes + aprobadas + rechazadas)
                .pendientes(pendientes)
                .aprobadas(aprobadas)
                .rechazadas(rechazadas)
                .montoTotalAprobadas(montoAprobadas)
                .ventasPorDia(ventasPorDia)
                .build();
    }

    // Por si se quiere saber informacion extra de venta o usuario

    private Usuario getUsuarioByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
    }

    private Venta getVentaPendiente(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada: " + id));
        if (venta.getEstado() != Estado.PENDIENTE) {
            throw new BusinessException("La venta ya fue procesada. Estado actual: " + venta.getEstado());
        }
        return venta;
    }
}
