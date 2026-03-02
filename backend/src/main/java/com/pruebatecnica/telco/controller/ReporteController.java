package com.pruebatecnica.telco.controller;

import com.pruebatecnica.telco.dto.response.VentaResponse;
import com.pruebatecnica.telco.service.VentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

@RestController
@RequestMapping("api/v1/reportes")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Reportes y resumenes para supervisores")
public class ReporteController {
    private final VentaService ventaService;

    @GetMapping("/resumen")
    @PreAuthorize("hasRole('SUPERVISOR')")
    @Operation(
            summary = "Resumen de ventas del equipo",
            description = "Retorna conteos por estado, monto aprobado y serie por día. " +
                    "Parámetros: periodo=DIA|MES o desde+hasta (ISO datetime). " +
                    "Si se usa periodo=DIA se usa la fecha actual; periodo=MES usa el mes actual."
    )
    public ResponseEntity<VentaResponse.Resumen> getResumen(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) String periodo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {

        LocalDateTime[] rango = resolveRango(periodo, desde, hasta);
        return ResponseEntity.ok(ventaService.getResumen(user.getUsername(), rango[0], rango[1]));
    }

    private LocalDateTime[] resolveRango(String periodo, LocalDateTime desde, LocalDateTime hasta) {
        if (periodo != null) {
            return switch (periodo.toUpperCase()) {
                case "DIA" -> new LocalDateTime[]{
                        LocalDate.now().atStartOfDay(),
                        LocalDate.now().atTime(23, 59, 59)
                };
                case "MES" -> {
                    YearMonth ym = YearMonth.now();
                    yield new LocalDateTime[]{
                            ym.atDay(1).atStartOfDay(),
                            ym.atEndOfMonth().atTime(23, 59, 59)
                    };
                }
                default -> throw new com.pruebatecnica.telco.exception.BusinessException(
                        "Periodo inválido. Use DIA, MES o proporcione desde/hasta.");
            };
        }
        if (desde == null) desde = LocalDateTime.now().minusMonths(1);
        if (hasta == null) hasta = LocalDateTime.now();
        return new LocalDateTime[]{desde, hasta};
    }

}
