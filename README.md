# AsesorIA 🧮

**Contabilidad inteligente para Chile** — plataforma SaaS multi-tenant para estudios contables: gestiona varias empresas, sus declaraciones (SII), remuneraciones, documentos y más, desde un solo lugar.

> Proyecto full-stack construido con Next.js + TypeScript + Prisma.

---

## 🚀 Cómo correrlo

```bash
npm install
npx prisma db push      # crea la base de datos local (SQLite)
npx tsx prisma/seed.ts  # carga el demo limpio
npm run dev             # http://localhost:3000
```

**Cuenta demo:** `admin@demo.cl` / `demo1234`

---

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 (App Router) + React + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui + lucide-react |
| Backend | Server Actions de Next.js |
| Base de datos | Prisma + SQLite (dev) → PostgreSQL (prod) |
| Auth | NextAuth v5 (JWT) + bcrypt |
| Gráficos | Recharts |
| Tests | Vitest |

---

## ✨ Funcionalidades

- **Landing pública** + registro de estudios (onboarding)
- **Autenticación** con 4 roles: SUPERADMIN, ADMIN, CONTADOR, CLIENTE
- **Seguridad multi-tenant real**: cada rol ve solo lo que le corresponde
  - ADMIN → todas las empresas del estudio
  - CONTADOR → solo las asignadas
  - CLIENTE → solo su empresa
- **CRUD de empresas** con datos del SII (mock) y la Inspección del Trabajo
- **Dashboard** con métricas y gráficos del historial F29
- **Remuneraciones**: cálculo de liquidaciones (AFP 10%, salud 7%, líquido)
- **Documentos**: facturas/boletas con IVA automático
- **Gestión de usuarios**: invitar, asignar empresas, restablecer contraseñas
- **Alertas** de vencimientos · **Configuración** del estudio
- **Recuperar contraseña** con token
- Diseño responsive, loading skeletons, toasts y modales

---

## 🏗️ Decisiones de arquitectura

- **Patrón Adapter + Factory** para los servicios externos (SII, Dirección del Trabajo): hoy usan datos *mock*; el día de mañana se cambia a la API real (BaseAPI/Floid) tocando **un solo archivo**.
- **Seguridad centralizada** en `src/lib/accesoEmpresas.ts`: una sola fuente de verdad decide qué empresas ve cada usuario.
- **AuditLog inmutable**: cada acción queda registrada (pensado para la Ley 21.719 de protección de datos).
- Las contraseñas **nunca** se guardan en texto plano (bcrypt).

---

## 📁 Estructura

```
src/
├── app/
│   ├── (landing, login, registro, recuperar)
│   └── dashboard/
│       ├── empresas/      → CRUD + SII + empleados + remuneraciones + documentos
│       ├── usuarios/      → gestión de usuarios (admin)
│       ├── alertas/  configuracion/  mi-empresa/ (cliente)
├── lib/
│   ├── accesoEmpresas.ts        → seguridad por rol
│   ├── calculadoraLiquidacion.ts → cálculo de sueldos (+ tests)
│   └── services/                 → SII y DT (mock, patrón Adapter)
└── prisma/schema.prisma          → 15 tablas
```

---

## 🔜 Pendiente (requiere servicios externos de pago)

- Integración real con el SII (BaseAPI/Floid)
- Pagos / suscripciones (Mercado Pago)
- Chat con IA sobre los datos (Claude API)
- Envío de emails (recuperar clave público, notificaciones)

---

*Proyecto en desarrollo · 2026*
