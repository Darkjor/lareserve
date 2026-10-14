-- Leads de La Reserve en el proyecto Supabase compartido. Anon solo inserta; admin lee.
create table public.lareserve_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tipo text not null check (tipo in ('presentacion','legal','brochure','broker')),
  nombre text not null check (char_length(nombre) between 2 and 120),
  telefono text not null check (char_length(telefono) between 7 and 30),
  email text check (email is null or char_length(email) <= 160),
  contacto_preferido text check (contacto_preferido is null or char_length(contacto_preferido) <= 40),
  horario text check (horario is null or char_length(horario) <= 120),
  interes text check (interes is null or char_length(interes) <= 60),
  mensaje text check (mensaje is null or char_length(mensaje) <= 2000),
  locale text not null default 'es' check (locale in ('es','en'))
);
create index lareserve_leads_created_at_idx on public.lareserve_leads (created_at desc);
alter table public.lareserve_leads enable row level security;
create policy "publico inserta lareserve_leads" on public.lareserve_leads
  for insert to anon, authenticated with check (true);
create policy "admin lee lareserve_leads" on public.lareserve_leads
  for select to authenticated using ((select public.is_admin()));
revoke all on public.lareserve_leads from anon;
grant insert on public.lareserve_leads to anon;
revoke update, delete, truncate on public.lareserve_leads from anon, authenticated;
