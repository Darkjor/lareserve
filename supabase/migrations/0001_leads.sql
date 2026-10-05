-- Tabla de leads de La Reserve. Los formularios insertan con la service role (server action).
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tipo text not null check (tipo in ('presentacion', 'legal', 'brochure', 'broker')),
  nombre text not null,
  telefono text not null,
  email text,
  contacto_preferido text,
  horario text,
  interes text,
  mensaje text,
  locale text not null default 'es'
);
alter table public.leads enable row level security;
-- Sin politicas: solo la service role puede leer o escribir.
