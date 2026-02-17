# FISIOAPP MVP (Fase 1A)

Plataforma clínica-operativa para centros de fisioterapia: registro de dolor, planes de ejercicios, sesiones, agenda y alertas.

## Stack
- Next.js App Router (PWA)
- Supabase (Postgres + Auth + Storage)
- Tailwind CSS

## Configuración rápida
1. Crea un proyecto en Supabase.
2. Copia `.env.example` → `.env.local` y completa las variables.
3. Ejecuta la migración SQL en Supabase (`supabase/migrations/001_init.sql`).
4. Ejecuta el proyecto:

```bash
npm install
npm run dev
```

## Estructura
- `src/app`: rutas y vistas
- `src/lib`: clientes Supabase y utilidades
- `supabase/migrations`: esquema de base de datos y RLS

## Notas
- La integración con WhatsApp está preparada vía `notification_outbox`, pero el envío real aún no está implementado.
- Para crear centros automáticamente al registrarse, se recomienda definir `SUPABASE_SERVICE_ROLE_KEY`.
