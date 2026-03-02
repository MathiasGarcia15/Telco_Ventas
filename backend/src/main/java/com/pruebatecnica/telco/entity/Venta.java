package com.pruebatecnica.telco.entity;

import com.pruebatecnica.telco.enums.Estado;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agente_id", nullable = false)
    private Usuario agente;

    @Column(name = "dni_Cliente", nullable = false, length = 11)
    private String dniCliente;

    @Column(name = "nombre_cliente", nullable = false, length = 150)
    private String nombreCliente;

    @Column(name = "telefono_cliente", nullable = false, length = 9)
    private String telefonoCliente;

    @Column(name = "direccion_cliente", nullable = false)
    private String direccionCliente;

    @Column(name = "plan_actual", nullable = false, length = 100)
    private String planActual;

    @Column(name = "plan_nuevo", nullable = false, length = 100)
    private String planNuevo;

    @Column(name = "codigo_llamada", nullable = false, unique = true, length = 50)
    private String codigoLlamada;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String producto = "FIJA_HOGAR";

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Estado estado = Estado.PENDIENTE;

    @Column(name = "motivo_rechazo", columnDefinition = "TEXT")
    private String motivoRechazo;

    @Column(name = "fecha_registro", nullable = false)
    @Builder.Default
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "fecha_validacion")
    private LocalDateTime fechaValidacion;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
