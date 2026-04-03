-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activities (
  id text NOT NULL,
  universeId text,
  title text NOT NULL,
  category text,
  price text,
  image text,
  description text,
  minAdvanceDays integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_universeId_fkey FOREIGN KEY (universeId) REFERENCES public.universes(id)
);
CREATE TABLE public.journal_posts (
  id text NOT NULL,
  title text NOT NULL,
  category text,
  date text DEFAULT (CURRENT_DATE)::text,
  image text,
  excerpt text,
  content text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT journal_posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.products (
  id text NOT NULL,
  title text NOT NULL,
  category text,
  price numeric NOT NULL,
  oldPrice numeric,
  image text,
  description text,
  isExclusive boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'member'::text CHECK (role = ANY (ARRAY['admin'::text, 'vip'::text, 'member'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.reservations (
  id text NOT NULL,
  activityId text,
  activityTitle text,
  universeId text,
  date text,
  time text,
  name text,
  contact text,
  message text,
  status text DEFAULT 'pending'::text,
  channel text DEFAULT 'web'::text,
  createdAt timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT reservations_pkey PRIMARY KEY (id),
  CONSTRAINT reservations_activityId_fkey FOREIGN KEY (activityId) REFERENCES public.activities(id)
);
CREATE TABLE public.site_settings (
  id integer NOT NULL CHECK (id = 1),
  site_name text DEFAULT 'Casa Privilege'::text,
  contact_email text,
  phone text,
  address text,
  social_links jsonb DEFAULT '{"facebook": "", "linkedin": "", "instagram": ""}'::jsonb,
  maintenance_mode boolean DEFAULT false,
  hero_background_url text DEFAULT 'https://images.unsplash.com/photo-1540998145320-f5139c824c62?q=80&w=2940&auto=format&fit=crop'::text,
  hero_title text,
  hero_subtitle text,
  hero_cta text,
  brand_gold_color text DEFAULT '#E5A93A'::text,
  whatsapp_number text DEFAULT '1234567890'::text,
  logo_text text DEFAULT 'CASA PRIVILEGE'::text,
  footer_title text,
  footer_cta text,
  updated_at timestamp with time zone DEFAULT now(),
  blocked_dates ARRAY DEFAULT '{}'::text[],
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  role text,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  image text,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ticket_messages (
  id text NOT NULL,
  ticket_id text NOT NULL,
  sender text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT ticket_messages_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id)
);
CREATE TABLE public.tickets (
  id text NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'open'::text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tickets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.universes (
  id text NOT NULL,
  name text NOT NULL,
  flag text,
  location text,
  description text,
  heroImage text,
  gallery ARRAY DEFAULT '{}'::text[],
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT universes_pkey PRIMARY KEY (id)
);