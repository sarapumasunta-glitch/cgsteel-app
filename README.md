# Cg Steel Design — Sistema de Gestión Comercial y Operativa

Sistema compuesto por 3 bloques, según el requerimiento funcional:

1. **Portal Comercial** (`src/app/(public)`) — página institucional pública.
2. **Sistema de Gestión Interna** (`src/app/(admin)`) — CRM, cotizaciones,
   pedidos, expediente y dashboard. Protegido con Supabase Auth.
3. **Portal de Seguimiento del Cliente** (`src/app/seguimiento/[token]`) —
   sin necesidad de cuenta; acceso mediante token único por pedido.

## Stack

- Next.js 14 (App Router) + TypeScript + TailwindCSS
- Supabase (Postgres + Auth + Storage) — backend completo
- Netlify — hosting del frontend

## Arquitectura de datos (`supabase/migrations/`)

| Archivo | Contenido |
|---|---|
| `0001_init_schema.sql` | Tablas: `profiles`, `clients`, `quotes`, `quote_items`, `orders`, `order_status_history`, `order_files` (expediente), `purchases`, `transactions`, `quote_requests`. Incluye triggers de `updated_at` e historial automático de estados. |
| `0002_rls_policies.sql` | Row Level Security. Todo cerrado por defecto; solo staff (tabla `profiles`) opera el panel interno. El público solo puede insertar en `quote_requests`. |
| `0003_tracking_function.sql` | Función `get_order_by_tracking(token)` — el cliente accede a su pedido sin exponer la tabla `orders` directamente. |

**Por qué así:** el pedido nunca se expone vía RLS al público (ni de forma
anónima), porque un token filtrado o adivinado no debe dar acceso a la
tabla completa. La función `SECURITY DEFINER` limita exactamente los
campos y filas visibles.

**Preparado para roles futuros:** el enum `user_role` ya incluye
`ventas`, `produccion`, `contabilidad`, `supervisor`. Hoy todas las
políticas usan `is_staff()` (cualquiera con perfil), así que agregar
restricciones por rol más adelante es editar políticas, no rehacer el
esquema.

## Cómo poner en marcha (paso a paso)

1. **Crear el proyecto en Supabase** (https://supabase.com/dashboard).
2. Instalar la CLI de Supabase y enlazar el proyecto:
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref <tu-project-ref>
   ```
3. Aplicar las migraciones:
   ```bash
   supabase db push
   ```
4. Crear el primer usuario administrador desde el dashboard de Supabase
   (Authentication > Users > Add user), y luego insertar su perfil:
   ```sql
   insert into profiles (id, full_name, role)
   values ('<uuid-del-usuario>', 'Tu nombre', 'admin');
   ```
5. Copiar `.env.example` a `.env.local` y completar con las credenciales
   del proyecto (Project Settings > API).
6. Instalar dependencias y correr en local:
   ```bash
   npm install
   npm run dev
   ```
7. **Conectar el repo a Netlify** (Add new site > Import from Git) y
   configurar las mismas variables de entorno en Netlify (Site settings
   > Environment variables).

## Roadmap sugerido

- [x] Esquema de base de datos completo + RLS + portal de seguimiento
- [x] Scaffold Next.js con las 3 áreas y paleta visual
- [ ] Fase 1 — MVP: CRUD de Clientes, Pedidos (con cambio de estado y
      carga de archivos al expediente), portal de seguimiento funcional
      end-to-end, página comercial con contenido real (usar el catálogo
      ya elaborado)
- [ ] Fase 2 — Cotizaciones con generación de PDF y conversión a pedido
- [ ] Fase 3 — Dashboard completo (gráficos de ventas por canal,
      rentabilidad por proyecto, flujo de caja)
- [ ] Fase 4 — Compras y finanzas detalladas
- [ ] Fase 5 — Roles adicionales (ventas, producción, contabilidad)

## Nota sobre continuidad del desarrollo

Este scaffold está pensado para seguir desarrollándose de forma iterativa
con acceso real al repositorio, a `npm run dev` y a las credenciales de
Supabase/Netlify — algo mejor soportado en **Claude Code**, donde se
puede iterar módulo por módulo, correr la app localmente y desplegar.
