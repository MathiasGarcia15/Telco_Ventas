# Telco Ventas 📡

Sistema de gestión de ventas para el producto **Fija Hogar**, construido con Java 17 + Spring Boot 3 en el backend y React 18 en el frontend.

El flujo es simple: un agente registra una venta, backoffice la aprueba o rechaza, y el supervisor puede ver el rendimiento de su equipo con filtros y reportes.

---

## ¿Qué necesito para correrlo?

| Herramienta | Versión mínima |
|-------------|----------------|
| Java JDK    | 17             |
| Maven       | 3.8+ (o usa el `mvnw` incluido) |
| Node.js     | 18+            |
| MySQL       | 8.0+           |

---

## Levantarlo en local

### 1. Base de datos

Conéctate a MySQL como root y ejecuta esto:

```sql
CREATE DATABASE telco_ventas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'telco'@'localhost' IDENTIFIED BY 'telco123';
GRANT ALL PRIVILEGES ON telco_ventas.* TO 'telco'@'localhost';
FLUSH PRIVILEGES;
```

No necesitas crear las tablas a mano. Al iniciar el backend, Spring ejecuta automáticamente `schema.sql` y `data.sql`, que crean todo y cargan los datos de prueba.

---

### 2. Backend

Abre una terminal en la carpeta `backend/` y ejecuta:

**Windows**
```bash
mvnw.cmd spring-boot:run
```

**Linux / macOS**
```bash
./mvnw spring-boot:run
```

El servidor arranca en **http://localhost:8080**

Si quieres explorar los endpoints de forma interactiva, Swagger UI está disponible en:
**http://localhost:8080/swagger-ui.html**

---

### 3. Frontend

Abre otra terminal en la carpeta `frontend/Telco_Ventas_Frontend/` y ejecuta:

```bash
npm install
npm run dev
```

La app queda disponible en **http://localhost:5173**

---

## Variables de configuración

Todo está en `backend/src/main/resources/application.properties`. Si tu MySQL usa credenciales distintas a las del ejemplo, cámbialas ahí:

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/telco_ventas` | URL de conexión a MySQL |
| `spring.datasource.username` | `telco` | Usuario de la base de datos |
| `spring.datasource.password` | `telco123` | Contraseña |
| `jwt.secret` | (ver application.properties) | Clave para firmar los tokens JWT |
| `jwt.expiration` | `86400000` | Expiración del token en ms (24 horas) |
| `cors.allowed-origins` | `http://localhost:5173` | Origen permitido para CORS |
| `server.port` | `8080` | Puerto del backend |

---

## Puertos

| Servicio | Puerto |
|----------|--------|
| Backend (Spring Boot) | 8080 |
| Frontend (Vite / React) | 5173 |
| MySQL | 3306 |

---

## Usuarios de prueba

El seed incluye estos usuarios listos para usar:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `Admin*123` | ADMIN |
| `supervisor1` | `Sup*123` | SUPERVISOR |
| `agente1` | `Agente*123` | AGENTE |
| `agente2` | `Agente*123` | AGENTE |
| `back1` | `Back*123` | BACKOFFICE |

`agente1` y `agente2` están asignados a `supervisor1`, así que si entras como supervisor puedes ver las ventas de ambos.

También hay 10 ventas de ejemplo con estados variados (PENDIENTE, APROBADA, RECHAZADA) para que puedas probar todos los flujos sin tener que crear nada desde cero.

---

## Endpoints principales

```
POST   /api/v1/auth/login                 → Login, devuelve JWT

POST   /api/v1/ventas                     → Agente: registrar venta
GET    /api/v1/ventas/mis-ventas          → Agente: ver sus ventas

GET    /api/v1/ventas/pendientes          → Backoffice: ver pendientes
POST   /api/v1/ventas/{id}/aprobar        → Backoffice: aprobar
POST   /api/v1/ventas/{id}/rechazar       → Backoffice: rechazar (requiere motivo)

GET    /api/v1/ventas/equipo              → Supervisor: ventas del equipo
GET    /api/v1/reportes/resumen           → Supervisor: KPIs y serie por día
```

La documentación completa de todos los endpoints (parámetros, request/response) está en Swagger UI o en `docs/openapi.yaml`.

---

## Ejemplo rápido con curl

```bash
# 1. Hacer login y guardar el token
curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"agente1","password":"Agente*123"}'

# 2. Usar el token en las siguientes llamadas
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8080/api/v1/ventas/mis-ventas
```

---

## Estructura del proyecto

```
Telco_Ventas/
├── backend/                  # Spring Boot 3 + Java 17
│   └── src/main/
│       ├── java/com/telco/ventas/
│       │   ├── controller/   # AuthController, VentaController, ReporteController
│       │   ├── service/      # Lógica de negocio
│       │   ├── repository/   # Spring Data JPA
│       │   ├── entity/       # Usuario, Venta
│       │   ├── security/     # JWT filter, UserDetailsService
│       │   └── exception/    # GlobalExceptionHandler
│       └── resources/
│           ├── schema.sql    # Creación de tablas
│           ├── data.sql      # Datos de prueba
│           └── application.properties
├── frontend/
│   └── Telco_Ventas_Frontend/  # React 18 + Vite + Tailwind
│       └── src/
│           ├── pages/        # LoginPage, AgentePage, BackofficePage, SupervisorPage
│           ├── components/   # Layout
│           ├── context/      # AuthContext
│           └── services/     # axios config
├── docs/
│   ├── documentacion_tecnica.docx   # Diagrama + decisiones técnicas
│   └── openapi.yaml                 # Especificación OpenAPI 3.1
└── api-docs.json             # JSON generado por springdoc
```
