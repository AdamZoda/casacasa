-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activities (
  id text NOT NULL,
  universe_id text,
  title text NOT NULL,
  category text,
  price text,
  image text,
  description text,
  min_advance_days integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  has_articles boolean DEFAULT false,
  article_display_type character varying DEFAULT 'direct'::character varying CHECK (article_display_type::text = ANY (ARRAY['direct'::character varying, 'articles_only'::character varying]::text[])),
  is_featured boolean DEFAULT false,
  featured_order integer DEFAULT 0,
  featured_display_type character varying DEFAULT 'card'::character varying CHECK (featured_display_type::text = ANY (ARRAY['card'::character varying, 'hero'::character varying, 'grid'::character varying, 'carousel'::character varying]::text[])),
  featured_image_url character varying,
  featured_description text,
  featured_metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_universeId_fkey FOREIGN KEY (universe_id) REFERENCES public.universes(id)
);
CREATE TABLE public.articles (
  id text NOT NULL,
  activity_id text NOT NULL,
  title character varying NOT NULL,
  image character varying,
  description text,
  price_type character varying NOT NULL CHECK (price_type::text = ANY (ARRAY['fixed'::character varying, 'per_duration'::character varying]::text[])),
  price numeric,
  duration_unit character varying CHECK (duration_unit::text = ANY (ARRAY['day'::character varying, 'night'::character varying]::text[])),
  price_per_unit numeric,
  availability_count integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  is_featured boolean DEFAULT false,
  featured_order integer DEFAULT 0,
  featured_display_type character varying DEFAULT 'card'::character varying CHECK (featured_display_type::text = ANY (ARRAY['card'::character varying, 'hero'::character varying, 'grid'::character varying, 'carousel'::character varying]::text[])),
  featured_image_url character varying,
  featured_metadata jsonb DEFAULT '{}'::jsonb,
  content text DEFAULT ''::text,
  parent_article_id text,
  is_reservable boolean DEFAULT false,
  article_type character varying DEFAULT 'standalone'::character varying CHECK (article_type::text = ANY (ARRAY['standalone'::character varying, 'parent'::character varying, 'child'::character varying]::text[])),
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id),
  CONSTRAINT articles_parent_article_id_fkey FOREIGN KEY (parent_article_id) REFERENCES public.articles(id)
);
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  table_name text,
  operation text CHECK (operation = ANY (ARRAY['INSERT'::text, 'UPDATE'::text, 'DELETE'::text])),
  user_id uuid,
  record_id text,
  new_values jsonb,
  timestamp timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.featured_collection_items (
  id text NOT NULL,
  collection_id text NOT NULL,
  item_type character varying NOT NULL CHECK (item_type::text = ANY (ARRAY['activity'::character varying, 'article'::character varying]::text[])),
  item_id text NOT NULL,
  position integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT featured_collection_items_pkey PRIMARY KEY (id),
  CONSTRAINT featured_collection_items_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.featured_collections(id)
);
CREATE TABLE public.featured_collections (
  id text NOT NULL,
  name character varying NOT NULL,
  description text,
  display_style character varying DEFAULT 'infinite_scroll'::character varying CHECK (display_style::text = ANY (ARRAY['infinite_scroll'::character varying, 'carousel'::character varying, 'grid'::character varying, 'hero'::character varying]::text[])),
  max_items integer DEFAULT 10,
  sort_by character varying DEFAULT 'featured_order'::character varying CHECK (sort_by::text = ANY (ARRAY['featured_order'::character varying, 'created_at'::character varying, 'price'::character varying, 'popularity'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT featured_collections_pkey PRIMARY KEY (id)
);
CREATE TABLE public.global_services (
  id text NOT NULL,
  title text NOT NULL,
  description text,
  image text,
  link text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT global_services_pkey PRIMARY KEY (id)
);
CREATE TABLE public.journal_posts (
  id text NOT NULL,
  title text NOT NULL,
  category text,
  date text DEFAULT (CURRENT_DATE)::text,
  image text,
  excerpt text,
  content text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT journal_posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_email text NOT NULL,
  customer_name text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  payment_receipt_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  receipt_base64 text,
  user_id uuid,
  user_phone text,
  country text,
  phone_code text,
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.poi_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text UNIQUE,
  description text DEFAULT ''::text,
  emoji text DEFAULT '📍'::text,
  color text DEFAULT '#E5A93A'::text,
  logo_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('UTC'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('UTC'::text, now()),
  CONSTRAINT poi_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.points_of_interest (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT ''::text,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  type text,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('UTC'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('UTC'::text, now()),
  type_id uuid,
  CONSTRAINT points_of_interest_pkey PRIMARY KEY (id),
  CONSTRAINT fk_poi_type FOREIGN KEY (type_id) REFERENCES public.poi_types(id)
);
CREATE TABLE public.products (
  id text NOT NULL,
  title text NOT NULL,
  category text,
  price numeric NOT NULL,
  old_price numeric,
  image text,
  description text,
  is_exclusive boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'member'::text CHECK (role = ANY (ARRAY['admin'::text, 'vip'::text, 'member'::text])),
  created_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.reservations (
  id text NOT NULL,
  activity_id text,
  activity_title text,
  universe_id text,
  selected_date text,
  selected_time text,
  user_name text,
  contact text,
  message text,
  status text DEFAULT 'pending'::text,
  channel text DEFAULT 'web'::text,
  created_at timestamp with time zone DEFAULT now(),
  end_date text,
  country text,
  phone_code text,
  user_phone text,
  people_count integer,
  total_price numeric,
  receipt_base64 text,
  adults_count integer DEFAULT 1,
  children_count integer DEFAULT 0,
  booking_type text DEFAULT 'activity'::text,
  receipt_url text,
  whatsapp_confirmed boolean DEFAULT false,
  user_email text,
  user_id uuid,
  article_id text,
  article_title character varying,
  price_type character varying,
  CONSTRAINT reservations_pkey PRIMARY KEY (id),
  CONSTRAINT reservations_activityId_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id),
  CONSTRAINT reservations_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id)
);
CREATE TABLE public.site_settings (
  id integer NOT NULL CHECK (id = 1),
  site_name text DEFAULT 'Casa Privilege'::text,
  contact_email text,
  phone text,
  address text,
  social_links jsonb DEFAULT '{"facebook": "", "linkedin": "", "instagram": ""}'::jsonb,
  maintenance_mode boolean DEFAULT false,
  hero_background_url text,
  hero_title text,
  hero_subtitle text,
  hero_cta text,
  brand_gold_color text DEFAULT '#E5A93A'::text,
  whatsapp_number text DEFAULT '1234567890'::text,
  logo_text text DEFAULT 'CASA PRIVILEGE'::text,
  footer_title text,
  footer_cta text,
  blocked_dates ARRAY DEFAULT '{}'::text[],
  bank_name text DEFAULT ''::text,
  bank_beneficiary text DEFAULT 'COMANE EXCELLENCE SARL'::text,
  bank_rib text DEFAULT ''::text,
  hidden_pages ARRAY DEFAULT '{}'::text[],
  phones jsonb NOT NULL DEFAULT '[]'::jsonb,
  whatsapp_numbers jsonb NOT NULL DEFAULT '[]'::jsonb,
  font_style character varying NOT NULL DEFAULT 'original'::character varying CHECK (font_style::text = ANY (ARRAY['original'::text, 'outfit'::text, 'playfair'::text, 'raleway'::text, 'kiona'::text, 'riona'::text])),
  block_weekends boolean NOT NULL DEFAULT false,
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.testimonials (
  id text NOT NULL,
  name text NOT NULL,
  role text,
  content text NOT NULL,
  rating integer,
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
  hero_image text,
  gallery ARRAY DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT universes_pkey PRIMARY KEY (id)
);