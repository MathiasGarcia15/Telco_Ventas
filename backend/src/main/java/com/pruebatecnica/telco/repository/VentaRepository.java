package com.pruebatecnica.telco.repository;

import com.pruebatecnica.telco.entity.Venta;
import com.pruebatecnica.telco.enums.Estado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    boolean existsByCodigoLlamada(String codigoLlamada);

    //Esto es la venta de los agentes pero con sus filtros
    @Query("""
        SELECT v FROM Venta v
        WHERE v.agente.id = :agenteId
          AND (:estado IS NULL OR v.estado = :estado)
          AND (:desde IS NULL OR v.fechaRegistro >= :desde)
          AND (:hasta IS NULL OR v.fechaRegistro <= :hasta)
        """)
    Page<Venta> findByAgenteWithFilters(
            @Param("agenteId") Long agenteId,
            @Param("estado") Estado estado,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            Pageable pageable);

    Page<Venta> findByEstado(Estado estado, Pageable pageable);
    //Ventas que ve el supervisor con sus respectivos filtros
    @Query("""
        SELECT v FROM Venta v
        WHERE v.agente.supervisor.id = :supervisorId
          AND (:estado IS NULL OR v.estado = :estado)
          AND (:agenteId IS NULL OR v.agente.id = :agenteId)
          AND (:desde IS NULL OR v.fechaRegistro >= :desde)
          AND (:hasta IS NULL OR v.fechaRegistro <= :hasta)
        """)
    Page<Venta> findByEquipoWithFilters(
            @Param("supervisorId") Long supervisorId,
            @Param("estado") Estado estado,
            @Param("agenteId") Long agenteId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            Pageable pageable);
    //Estos son los conteos por estado para el supervisorr
    @Query("""
        SELECT v.estado, COUNT(v), COALESCE(SUM(v.monto), 0)
        FROM Venta v
        WHERE v.agente.supervisor.id = :supervisorId
          AND v.fechaRegistro >= :desde
          AND v.fechaRegistro <= :hasta
        GROUP BY v.estado
        """)
    List<Object[]> countByEstadoForSupervisor(
            @Param("supervisorId") Long supervisorId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta);

    //Aca estan la serie de ventas por día para el supervisor
    @Query(value = """
        SELECT DATE(v.fecha_registro) as fecha, COUNT(*) as cantidad, COALESCE(SUM(v.monto), 0) as monto
        FROM ventas v
        INNER JOIN usuarios u ON v.agente_id = u.id
        WHERE u.supervisor_id = :supervisorId
          AND v.fecha_registro >= :desde
          AND v.fecha_registro <= :hasta
        GROUP BY DATE(v.fecha_registro)
        ORDER BY DATE(v.fecha_registro)
        """, nativeQuery = true)
    List<Object[]> ventasPorDiaForSupervisor(
            @Param("supervisorId") Long supervisorId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta);


}
