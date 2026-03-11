-- ─────────────────────────────────────────────────────────────────────────────
-- San-Beï · Supabase Schema
-- À exécuter dans l'éditeur SQL de ton projet Supabase
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Table products
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('plat', 'epicerie')),
  title       text not null,
  description text,
  price       numeric(10, 2) not null,
  image       text,
  category    text not null,
  tag         text,
  unit        text,
  created_at  timestamptz default now()
);

-- 2. Row Level Security (RLS)
alter table public.products enable row level security;

-- Lecture publique (visiteurs du site)
create policy "Lecture publique"
  on public.products for select
  using (true);

-- Écriture réservée aux utilisateurs authentifiés (propriétaire)
create policy "Écriture propriétaire"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Données de test (optionnel)
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.products (type, title, description, price, category, tag, unit) values
  ('plat',     'Tajine d''agneau',        'Agneau confit aux pruneaux et épices douces.',        14.50, 'Viande',       'Du jour',    'portion'),
  ('plat',     'Risotto aux cèpes',       'Riz Arborio, cèpes sauvages, parmesan affiné.',       12.00, 'Végétarien',   'Végétarien', 'portion'),
  ('epicerie', 'Huile d''olive extra vierge', 'Première pression à froid, domaine sicilien.',    12.50, 'Épicerie sèche','Coup de cœur','500ml'),
  ('epicerie', 'Kombucha gingembre',      'Fermenté artisanalement, pétillant naturel.',          4.20, 'Boissons',     'Bio',        '33cl');
