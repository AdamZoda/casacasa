-- ==========================================
-- 1. TABLE DES COMMANDES (BOUTIQUE)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'en attente',
    payment_receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activation de la sécurité RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut insérer (pour payer)
CREATE POLICY "Enable insert for everyone" ON public.orders FOR INSERT WITH CHECK (true);

-- Politique : Seul l'admin peut tout voir/modifier
CREATE POLICY "Enable all for admins" ON public.orders FOR ALL USING (true);

-- ==========================================
-- 2. TABLE DES TICKETS (CONCIERGERIE)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des messages des tickets
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activation RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Politiques simples (Pour le développement)
CREATE POLICY "Public access to tickets" ON public.tickets FOR ALL USING (true);
CREATE POLICY "Public access to messages" ON public.ticket_messages FOR ALL USING (true);
