package com.pruebatecnica.telco.mapper;

import com.pruebatecnica.telco.dto.response.VentaResponse;
import com.pruebatecnica.telco.entity.Venta;
import org.springframework.stereotype.Component;

@Component
public class VentaMapper {
    public VentaResponse.Detalle toDetalle(Venta venta) {
        return VentaResponse.Detalle.builder()
                .id(venta.getId())
                .agenteId(venta.getAgente().getId())
                .agenteUsername(venta.getAgente().getUsername())
                .dniCliente(venta.getDniCliente())
                .nombreCliente(venta.getNombreCliente())
                .telefonoCliente(venta.getTelefonoCliente())
                .direccionCliente(venta.getDireccionCliente())
                .planActual(venta.getPlanActual())
                .planNuevo(venta.getPlanNuevo())
                .codigoLlamada(venta.getCodigoLlamada())
                .producto(venta.getProducto())
                .monto(venta.getMonto())
                .estado(venta.getEstado())
                .motivoRechazo(venta.getMotivoRechazo())
                .fechaRegistro(venta.getFechaRegistro())
                .fechaValidacion(venta.getFechaValidacion())
                .createdAt(venta.getCreatedAt())
                .updatedAt(venta.getUpdatedAt())
                .build();
    }
}
