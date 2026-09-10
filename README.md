# Backend — Comercial Camila (sistema-inventario-back)

Backend del sistema de gestión de tienda **Comercial Camila** (venta en tienda / punto de venta, rubro cuidado personal y perfumería).

## Stack
- **NestJS** (Node + TypeScript)
- **Prisma** (ORM)
- **PostgreSQL** (base de datos — recomendado: Neon en la nube)

## Puesta en marcha
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear el archivo `.env` a partir de `.env.example` y poner tu cadena de conexión de PostgreSQL (Neon):
   ```
   DATABASE_URL="postgresql://usuario:password@host.neon.tech/comercial_camila?sslmode=require"
   PORT=3000
   ```
3. Generar el cliente de Prisma y crear las tablas:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate   # crea la migración inicial en la BD
   ```
4. Levantar el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```
   API disponible en `http://localhost:3000/api`.

## Endpoints iniciales
- `GET /api` — estado del servicio.
- `GET /api/products` — listar productos.
- `GET /api/products/:id` — obtener un producto.
- `POST /api/products` — crear producto.
- `PATCH /api/products/:id` — actualizar producto.
- `DELETE /api/products/:id` — eliminar producto.

## Modelo de datos (Prisma)
Product, Supplier, Customer, StaffUser, Sale, SaleItem. Ver `prisma/schema.prisma`.

## Próximos pasos
- Módulos de proveedores, clientes, usuarios/roles y ventas (POS con descuento de stock).
- Autenticación por rol (administrador/a, vendedor/a, inventarista).
- Conectar el frontend (`sistema-inventario`) a esta API.
- Lectura de código de barras.
