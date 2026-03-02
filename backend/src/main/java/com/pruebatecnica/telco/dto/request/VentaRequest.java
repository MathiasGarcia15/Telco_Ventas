package com.pruebatecnica.telco.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

public class VentaRequest {
    @Data
    public static class CrearVenta {

        @NotBlank(message = "DNI del cliente es obligatorio")
        @Pattern(regexp = "\\d{8}|\\d{11}", message = "DNI debe tener 8 u 11 dígitos")
        private String dniCliente;

        @NotBlank(message = "Nombre del cliente es obligatorio")
        private String nombreCliente;

        @NotBlank(message = "Teléfono del cliente es obligatorio")
        @Pattern(regexp = "\\d{9}", message = "Teléfono debe tener 9 dígitos")
        private String telefonoCliente;

        @NotBlank(message = "Dirección del cliente es obligatoria")
        private String direccionCliente;

        @NotBlank(message = "Plan actual es obligatorio")
        private String planActual;

        @NotBlank(message = "Plan nuevo es obligatorio")
        private String planNuevo;

        @NotBlank(message = "Código de llamada es obligatorio")
        private String codigoLlamada;

        private String producto = "FIJA_HOGAR";

        @NotNull(message = "Monto es obligatorio")
        @DecimalMin(value = "0.01", message = "Monto debe ser mayor a 0")
        private BigDecimal monto;
    }

    @Data
    public static class RechazarVenta {
        @NotBlank(message = "Motivo de rechazo es obligatorio")
        private String motivoRechazo;
    }
}
