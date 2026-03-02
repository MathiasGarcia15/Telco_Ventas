package com.pruebatecnica.telco.dto.response;

import com.pruebatecnica.telco.entity.Venta;
import com.pruebatecnica.telco.enums.Estado;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class VentaResponse {
    @Data
    @Builder
    public static class Detalle {
        private Long id;
        private Long agenteId;
        private String agenteUsername;
        private String dniCliente;
        private String nombreCliente;
        private String telefonoCliente;
        private String direccionCliente;
        private String planActual;
        private String planNuevo;
        private String codigoLlamada;
        private String producto;
        private BigDecimal monto;
        private Estado estado;
        private String motivoRechazo;
        private LocalDateTime fechaRegistro;
        private LocalDateTime fechaValidacion;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    public static class Resumen {
        private LocalDateTime desde;
        private LocalDateTime hasta;
        private long totalVentas;
        private long pendientes;
        private long aprobadas;
        private long rechazadas;
        private BigDecimal montoTotalAprobadas;
        private List<VentaDia> ventasPorDia;
    }

    @Data
    @Builder
    public static class VentaDia {
        private String fecha;
        private long cantidad;
        private BigDecimal monto;
    }
}
