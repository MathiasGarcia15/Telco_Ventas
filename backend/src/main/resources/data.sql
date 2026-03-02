-- ============================================================
-- TELCO VENTAS - Seed Data
-- ============================================================

-- Limpiar datos previos (orden por FK)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE ventas;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- USUARIOS
-- Passwords generados con BCrypt strength=10:
-- Admin*123   → $2a$10$...
-- Agente*123  → $2a$10$...
-- Back*123    → $2a$10$...
-- Sup*123     → $2a$10$...
-- ============================================================

INSERT INTO usuarios
(id, username, password_hash, rol, supervisor_id, activo, created_at, updated_at)
VALUES
    (1, 'admin',      '$2a$10$43.Aw2bE/D8VT/JkkkWnxu1y7oOx4Engu6WA7H9WG2F5CMkmXknMi', 'ADMIN',       NULL, TRUE, NOW(), NOW()),
    (2, 'supervisor1','$2a$10$TTazpsSvYFC/tlrI5qOhEud4BZ.xekaDhnQy8/Sa40DtbWVoWC2Xy', 'SUPERVISOR',  NULL, TRUE, NOW(), NOW()),
    (3, 'agente1',    '$2a$10$lhA5r1wgN6WCwHK00OMBkOYApp5j/O8cGOQS2YmuxHGFUIQYjms.S', 'AGENTE',      2,    TRUE, NOW(), NOW()),
    (4, 'agente2',    '$2a$10$lhA5r1wgN6WCwHK00OMBkOYApp5j/O8cGOQS2YmuxHGFUIQYjms.S', 'AGENTE',      2,    TRUE, NOW(), NOW()),
    (5, 'back1',      '$2a$10$fdQrrL7tAqDYeWe5xfQCo.4h0Db6lVNnQi56JvfpolDPbvgY3Zrvy', 'BACKOFFICE',  NULL, TRUE, NOW(), NOW());

-- ============================================================
-- VENTAS (5-10 variadas)
-- ============================================================

INSERT INTO ventas (
    agente_id, dni_cliente, nombre_cliente, telefono_cliente, direccion_cliente,
    plan_actual, plan_nuevo, codigo_llamada, producto, monto, estado,
    motivo_rechazo, fecha_registro, fecha_validacion,
    created_at, updated_at
) VALUES

      (3, '45678901', 'Carlos Mendoza Rios', '987654321', 'Av. Arequipa 1234, Lima',
       'Plan Basic 50Mbps', 'Plan Pro 200Mbps', 'CALL-2024-001', 'FIJA_HOGAR', 89.90,
       'APROBADA', NULL, '2024-11-01 09:00:00', '2024-11-01 11:30:00',
       NOW(), NOW()),

      (3, '78901234', 'María López Torres', '912345678', 'Jr. Cusco 456, Miraflores',
       'Sin plan', 'Plan Basic 50Mbps', 'CALL-2024-002', 'FIJA_HOGAR', 59.90,
       'APROBADA', NULL, '2024-11-02 10:15:00', '2024-11-02 14:00:00',
       NOW(), NOW()),

      (4, '23456789', 'Jorge Huamán Ccasa', '945678901', 'Av. Brasil 789, Breña',
       'Plan Basic 50Mbps', 'Plan Ultra 500Mbps', 'CALL-2024-003', 'FIJA_HOGAR', 149.90,
       'APROBADA', NULL, '2024-11-03 08:30:00', '2024-11-03 10:00:00',
       NOW(), NOW()),

      (3, '34567890', 'Ana Flores Vargas', '923456789', 'Calle Los Pinos 12, San Isidro',
       'Plan Pro 200Mbps', 'Plan Ultra 500Mbps', 'CALL-2024-004', 'FIJA_HOGAR', 149.90,
       'RECHAZADA', 'Cliente ya tiene contrato vigente hasta 2025',
       '2024-11-04 11:00:00', '2024-11-04 16:00:00',
       NOW(), NOW()),

      (4, '56789012', 'Roberto Silva Paredes', '934567890', 'Av. Javier Prado 3456, San Borja',
       'Sin plan', 'Plan Pro 200Mbps', 'CALL-2024-005', 'FIJA_HOGAR', 89.90,
       'RECHAZADA', 'Dirección fuera de cobertura de red',
       '2024-11-05 09:45:00', '2024-11-05 12:30:00',
       NOW(), NOW()),

      (3, '67890123', 'Lucía Quispe Mamani', '956789012', 'Jr. Amazonas 234, Cercado',
       'Plan Basic 50Mbps', 'Plan Pro 200Mbps', 'CALL-2024-006', 'FIJA_HOGAR', 89.90,
       'PENDIENTE', NULL, '2024-11-10 10:00:00', NULL,
       NOW(), NOW()),

      (4, '89012345', 'Diego Castillo Ruiz', '967890123', 'Av. Colonial 567, Pueblo Libre',
       'Sin plan', 'Plan Basic 50Mbps', 'CALL-2024-007', 'FIJA_HOGAR', 59.90,
       'PENDIENTE', NULL, '2024-11-11 14:20:00', NULL,
       NOW(), NOW()),

      (3, '90123456', 'Patricia Moreno Vega', '978901234', 'Calle Bolognesi 89, Barranco',
       'Plan Pro 200Mbps', 'Plan Ultra 500Mbps', 'CALL-2024-008', 'FIJA_HOGAR', 149.90,
       'PENDIENTE', NULL, '2024-11-12 08:00:00', NULL,
       NOW(), NOW()),

      (4, '12345678', 'Fernando Torres Espinoza', '989012345', 'Av. Salaverry 890, Jesús María',
       'Sin plan', 'Plan Ultra 500Mbps', 'CALL-2024-009', 'FIJA_HOGAR', 149.90,
       'PENDIENTE', NULL, '2024-11-12 16:30:00', NULL,
       NOW(), NOW()),

      (3, '11223344', 'Carmen Gutiérrez Soto', '991234567', 'Jr. Tacna 1011, Cercado',
       'Plan Basic 50Mbps', 'Plan Pro 200Mbps', 'CALL-2024-010', 'FIJA_HOGAR', 89.90,
       'PENDIENTE', NULL, '2024-11-13 11:10:00', NULL,
       NOW(), NOW());