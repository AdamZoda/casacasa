-- =============================================================================
-- Casa Privilege — schéma complémentaire, index, RLS (Supabase SQL Editor)
-- Exécuter après vos CREATE TABLE de base (voir SQL.SQL dans le dépôt).
-- À adapter en production : politiques plus strictes + rôle admin côté DB.
-- =============================================================================

-- Extensions utiles (souvent déjà activées sur Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Colonne attendue par le client (réservations : email client)
-- -----------------------------------------------------------------------------
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS user_email text;

-- -----------------------------------------------------------------------------
-- site_settings : une ligne id = 1 (évite 404 / single() vide au premier run)
-- -----------------------------------------------------------------------------
INSERT INTO public.site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Index (lectures triées / jointures fréquentes)
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations (created_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets (created_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON public.ticket_messages (ticket_id);
CREATE INDEX IF NOT EXISTS idx_activities_universe_id ON public.activities (universe_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON public.testimonials (is_approved) WHERE is_approved = true;

-- -----------------------------------------------------------------------------
-- RLS : lecture catalogue pour le site public (anon + authenticated)
-- Écritures nécessaires pour réservations / boutique / contact sans backend dédié.
-- ⚠️ En production : restreindre UPDATE/DELETE au rôle admin (JWT claims ou service_role).
-- -----------------------------------------------------------------------------

-- --- universes
ALTER TABLE public.universes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "universes_select_public" ON public.universes;
CREATE POLICY "universes_select_public" ON public.universes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "universes_write_authenticated" ON public.universes;
CREATE POLICY "universes_write_authenticated" ON public.universes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --- activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activities_select_public" ON public.activities;
CREATE POLICY "activities_select_public" ON public.activities FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "activities_write_authenticated" ON public.activities;
CREATE POLICY "activities_write_authenticated" ON public.activities FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --- products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public" ON public.products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "products_write_authenticated" ON public.products;
CREATE POLICY "products_write_authenticated" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --- journal_posts
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "journal_select_public" ON public.journal_posts;
CREATE POLICY "journal_select_public" ON public.journal_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "journal_write_authenticated" ON public.journal_posts;
CREATE POLICY "journal_write_authenticated" ON public.journal_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --- global_services
ALTER TABLE public.global_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "global_services_select_public" ON public.global_services;
CREATE POLICY "global_services_select_public" ON public.global_services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "global_services_write_authenticated" ON public.global_services;
CREATE POLICY "global_services_write_authenticated" ON public.global_services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --- site_settings (lecture publique pour hero / footer ; écriture connecté)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_settings_select_public" ON public.site_settings;
CREATE POLICY "site_settings_select_public" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "site_settings_write_authenticated" ON public.site_settings;
CREATE POLICY "site_settings_write_authenticated" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --- reservations (création depuis le site sans compte)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reservations_select_authenticated" ON public.reservations;
CREATE POLICY "reservations_select_authenticated" ON public.reservations FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "reservations_insert_anon" ON public.reservations;
CREATE POLICY "reservations_insert_anon" ON public.reservations FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "reservations_insert_authenticated" ON public.reservations;
CREATE POLICY "reservations_insert_authenticated" ON public.reservations FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "reservations_write_authenticated" ON public.reservations;
CREATE POLICY "reservations_write_authenticated" ON public.reservations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "reservations_delete_authenticated" ON public.reservations;
CREATE POLICY "reservations_delete_authenticated" ON public.reservations FOR DELETE TO authenticated USING (true);

-- --- orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_select_authenticated" ON public.orders;
CREATE POLICY "orders_select_authenticated" ON public.orders FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "orders_insert_anon" ON public.orders;
CREATE POLICY "orders_insert_anon" ON public.orders FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "orders_insert_authenticated" ON public.orders;
CREATE POLICY "orders_insert_authenticated" ON public.orders FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "orders_write_authenticated" ON public.orders;
CREATE POLICY "orders_write_authenticated" ON public.orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "orders_delete_authenticated" ON public.orders;
CREATE POLICY "orders_delete_authenticated" ON public.orders FOR DELETE TO authenticated USING (true);

-- --- tickets & messages (support / contact)
-- ⚠️ Le front actuel utilise la clé anon pour retrouver un ticket par email et lire les messages.
--    SELECT ouvert pour anon : à remplacer en prod par auth anonyme / Edge Function / claim JWT.
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tickets_select_public" ON public.tickets;
CREATE POLICY "tickets_select_public" ON public.tickets FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "tickets_insert_anon" ON public.tickets;
CREATE POLICY "tickets_insert_anon" ON public.tickets FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "tickets_insert_authenticated" ON public.tickets;
CREATE POLICY "tickets_insert_authenticated" ON public.tickets FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "tickets_update_authenticated" ON public.tickets;
CREATE POLICY "tickets_update_authenticated" ON public.tickets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ticket_messages_select_public" ON public.ticket_messages;
CREATE POLICY "ticket_messages_select_public" ON public.ticket_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "ticket_messages_insert_anon" ON public.ticket_messages;
CREATE POLICY "ticket_messages_insert_anon" ON public.ticket_messages FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "ticket_messages_insert_authenticated" ON public.ticket_messages;
CREATE POLICY "ticket_messages_insert_authenticated" ON public.ticket_messages FOR INSERT TO authenticated WITH CHECK (true);

-- --- testimonials (anon : approuvés uniquement ; connecté : modération admin)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonials_select_public_approved" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_select_anon_approved" ON public.testimonials;
CREATE POLICY "testimonials_select_anon_approved" ON public.testimonials
  FOR SELECT TO anon USING (is_approved = true);
DROP POLICY IF EXISTS "testimonials_select_all_authenticated" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_select_authenticated" ON public.testimonials;
CREATE POLICY "testimonials_select_authenticated" ON public.testimonials FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "testimonials_insert_anon" ON public.testimonials;
CREATE POLICY "testimonials_insert_anon" ON public.testimonials FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_write_authenticated" ON public.testimonials;
CREATE POLICY "testimonials_write_authenticated" ON public.testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_delete_authenticated" ON public.testimonials;
CREATE POLICY "testimonials_delete_authenticated" ON public.testimonials FOR DELETE TO authenticated USING (true);

-- --- newsletter
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "newsletter_select_authenticated" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_select_authenticated" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "newsletter_insert_anon" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_insert_anon" ON public.newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "newsletter_delete_authenticated" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_delete_authenticated" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (true);

-- -----------------------------------------------------------------------------
-- Profils : garder fix_profiles_rls.sql pour la base ; option admin (durcissement)
-- Pour permettre à un admin (role = 'admin' dans profiles) de lire / modifier tous les profils,
-- remplacer les politiques par des versions basées sur une fonction SECURITY DEFINER.
-- Exemple (à activer seulement si vous en avez besoin) :
--
-- CREATE OR REPLACE FUNCTION public.is_admin()
-- RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
--   SELECT EXISTS (
--     SELECT 1 FROM public.profiles p
--     WHERE p.id = auth.uid() AND p.role = 'admin'
--   );
-- $$;
--
-- Puis policies profiles : SELECT USING (auth.uid() = id OR public.is_admin()); etc.
-- -----------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
