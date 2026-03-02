package com.pruebatecnica.telco.controller;

import com.pruebatecnica.telco.dto.request.VentaRequest;
import com.pruebatecnica.telco.dto.response.VentaResponse;
import com.pruebatecnica.telco.enums.Estado;
import com.pruebatecnica.telco.service.VentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/ventas")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Ventas", description = "Gestion de ventas Telco Fija Hogar")
public class VentaController {
    private final VentaService ventaService;

    // CRUD PARA EL AGENTE

    @PostMapping
    @PreAuthorize("hasRole('AGENTE')")
    @Operation(summary = "Crear venta", description = "Agente registra una nueva venta en estado PENDIENTE")
    public ResponseEntity<VentaResponse.Detalle> crearVenta(
            @Valid @RequestBody VentaRequest.CrearVenta request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ventaService.crearVenta(request, user.getUsername()));
    }

    @GetMapping("/mis-ventas")
    @PreAuthorize("hasRole('AGENTE')")
    @Operation(summary = "Mis ventas", description = "Lista las ventas del agente autenticado con filtros opcionales")
    public ResponseEntity<Page<VentaResponse.Detalle>> getMisVentas(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaRegistro") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        return ResponseEntity.ok(
                ventaService.getMisVentas(user.getUsername(), estado, desde, hasta, page, size, sortBy, direction));
    }

    // CURD PARA EL BACKOFFICE

    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('BACKOFFICE')")
    @Operation(summary = "Ventas pendientes", description = "Lista todas las ventas en estado PENDIENTE")
    public ResponseEntity<Page<VentaResponse.Detalle>> getPendientes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ventaService.getPendientes(page, size));
    }

    @PostMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('BACKOFFICE')")
    @Operation(summary = "Aprobar venta", description = "Cambia estado a APROBADA y registra fecha_validacion")
    public ResponseEntity<VentaResponse.Detalle> aprobarVenta(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.aprobarVenta(id));
    }

    @PostMapping("/{id}/rechazar")
    @PreAuthorize("hasRole('BACKOFFICE')")
    @Operation(summary = "Rechazar venta", description = "Cambia estado a RECHAZADA con motivo obligatorio")
    public ResponseEntity<VentaResponse.Detalle> rechazarVenta(
            @PathVariable Long id,
            @Valid @RequestBody VentaRequest.RechazarVenta request) {
        return ResponseEntity.ok(ventaService.rechazarVenta(id, request));
    }

    // CRUD PARA EL SUPERVISOR

    @GetMapping("/equipo")
    @PreAuthorize("hasRole('SUPERVISOR')")
    @Operation(summary = "Ventas del equipo", description = "Supervisor consulta ventas de sus agentes con filtros")
    public ResponseEntity<Page<VentaResponse.Detalle>> getVentasEquipo(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) Long agenteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ventaService.getVentasEquipo(user.getUsername(), estado, agenteId, desde, hasta, page, size));
    }
}
