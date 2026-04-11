import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { universes as initialUniverses, journalPosts as initialJournalPosts } from '../data/content';
import { Language } from '../i18n/translations';
import { supabase } from '../lib/supabase';
import {
  dbRowToSiteSettings,
  siteSettingsToDbRow,
  type SiteSettings,
  type SiteSettingsRow,
} from '../lib/siteSettingsDb';
import { fetchExchangeRates, type Currency, type ExchangeRates, DEFAULT_EXCHANGE_RATES } from '../lib/utils';
import {
  activityToRow,
  dbRowToReservation,
  productToRow,
  reservationInputToDbRow,
  rowToActivity,
  rowToJournalPost,
  rowToOrder,
  rowToProduct,
  rowToSubscriber,
  rowToTestimonial,
  rowToUniverse,
  testimonialToRow,
  universeToRow,
  type ReservationRow,
} from '../lib/tableMappers';

export interface Reservation {
  id: string;
  activity_id: string;
  activity_title: string;
  universe_id: string;
  date: string;
  end_date?: string;
  time: string;
  name: string;
  country?: string;
  phone_code?: string;
  phone?: string;
  email?: string;
  contact: string;
  people_count?: number;
  total_price?: number;
  receipt_base64?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  channel: 'web' | 'whatsapp';
  message?: string;
  article_id?: string;
  article_title?: string;
  price_type?: 'fixed' | 'per_duration';
  created_at: string;
}

export interface Universe {
  id: string;
  name: string;
  flag: string;
  location: string;
  description: string;
  heroImage: string;
  gallery: string[];
}

export interface Article {
  id: string;
  activityId: string;
  title: string;
  image: string;
  description: string;
  priceType: 'fixed' | 'per_duration';
  price?: number;
  durationUnit?: 'day' | 'night';
  pricePerUnit?: number;
  availabilityCount?: number;
}

export interface Activity {
  id: string;
  universeId: string;
  title: string;
  category: string;
  price: string;
  image: string;
  description: string;
  minAdvanceDays?: number;
  hasArticles?: boolean;
  articleDisplayType?: 'direct' | 'articles_only';
  articles?: Article[];
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  isExclusive?: boolean;
}

export interface JournalPost {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  isApproved: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export type { SiteSettings };

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_name: string;
  user_email: string;
  subject: string;
  status: 'open' | 'closed';
  created_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender: string;
  content: string;
  created_at: string;
}

export interface GlobalService {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  type?: string; // Categorie: restaurant, shop, activity, etc.
  latitude?: number;
  longitude?: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  items: any[];
  receipt_base64?: string;
  user_phone?: string;
  country?: string;
  phone_code?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export type Theme = 'light' | 'dark';

interface AppContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updateReservationStatus: (id: string, status: Reservation['status']) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  
  tickets: Ticket[];
  refreshTickets: () => Promise<void>;
  addTicket: (ticket: Omit<Ticket, 'id' | 'created_at' | 'status'>) => Promise<string>;
  updateTicketStatus: (id: string, status: Ticket['status']) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  
  ticketMessages: TicketMessage[];
  addTicketMessage: (message: Omit<TicketMessage, 'id' | 'created_at'>) => Promise<void>;
  fetchTicketMessages: (ticketId: string) => Promise<TicketMessage[]>;

  universes: Universe[];
  addUniverse: (u: Universe) => void;
  updateUniverse: (u: Universe) => void;
  deleteUniverse: (id: string) => void;
  
  activities: Activity[];
  addActivity: (a: Activity) => void;
  updateActivity: (a: Activity) => void;
  deleteActivity: (id: string) => void;

  articles: Article[];
  addArticle: (a: Article) => void;
  updateArticle: (a: Article) => void;
  deleteArticle: (id: string) => void;
  getArticlesByActivityId: (activityId: string) => Article[];

  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;

  journalPosts: JournalPost[];
  addJournalPost: (p: JournalPost) => void;
  updateJournalPost: (p: JournalPost) => void;
  deleteJournalPost: (id: string) => void;

  testimonials: Testimonial[];
  addTestimonial: (t: Omit<Testimonial, 'id' | 'isApproved'>) => void;
  updateTestimonial: (t: Testimonial) => void;
  deleteTestimonial: (id: string) => void;

  globalServices: GlobalService[];
  addGlobalService: (s: GlobalService) => void;
  updateGlobalService: (s: GlobalService) => void;
  deleteGlobalService: (id: string) => void;

  subscribers: NewsletterSubscriber[];
  subscribeNewsletter: (email: string) => Promise<boolean>;
  unsubscribeNewsletter: (id: string) => Promise<void>;
  refreshNewsletterSubscribers: () => Promise<void>;

  settings: SiteSettings;
  updateSettings: (s: SiteSettings) => void;

  cart: Product[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;

  favorites: string[];
  toggleFavorite: (id: string) => void;

  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRates: ExchangeRates;
  refreshExchangeRates: () => Promise<void>;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  profiles: Profile[];
  deleteProfile: (id: string) => void;

  theme: Theme;
  toggleTheme: () => void;

  language: Language;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initUniverses = Object.values(initialUniverses).map(u => ({
  id: u.id, name: u.name, flag: u.flag, location: u.location, description: u.description, heroImage: u.heroImage, gallery: u.gallery
}));

const initActivities: Activity[] = Object.values(initialUniverses).flatMap(u => 
  u.activities.map((a: any) => ({ ...a, universeId: u.id, minAdvanceDays: 0 }))
);

const initProducts: Product[] = [
  {
    id: "p-1",
    title: "Sculpture Harmonie",
    category: "MODERN STATUE",
    price: 8800,
    oldPrice: 11000,
    image: "https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=2940&auto=format&fit=crop",
    description: "Sculpture décorative 'Harmonie' représentant une composition artistique tenant une sphère, symbole d'équilibre.",
    isExclusive: true
  },
  {
    id: "p-2",
    title: "Sculpture Equilibre Eternel",
    category: "FUSION RÉSINE ET FIBRE",
    price: 8550,
    oldPrice: 9000,
    image: "https://images.unsplash.com/photo-1554188248-986da1702485?q=80&w=2940&auto=format&fit=crop",
    description: "Fusion de résine et fibre sur socle métallique, symbole d'harmonie et modernité."
  }
];

import { globalServices as initGlobalServices } from '../data/content';

export function AppProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [universes, setUniverses] = useState<Universe[]>(initUniverses);
  const [activities, setActivities] = useState<Activity[]>(initActivities);
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<Product[]>(initProducts);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>(initialJournalPosts);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: 't-1', name: 'Alexander Rossi', role: 'CEO, Global Tech', content: 'Casa Privilege a transformé ma vision du luxe.', rating: 5, isApproved: true }
  ]);
  const [globalServices, setGlobalServices] = useState<GlobalService[]>(initGlobalServices);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Casa Privilege',
    contactEmail: 'contact@casaprivilege.com',
    phones: [],
    address: 'Marrakech, Maroc',
    socialLinks: { instagram: [], facebook: [], linkedin: [], youtube: [] },
    maintenanceMode: false,
    heroBackgroundUrl: '',
    heroTitle: '', heroSubtitle: '', heroCta: '', brandGoldColor: '#E5A93A', whatsappNumbers: [], logoText: 'CASA PRIVILEGE', footerTitle: '', footerCta: '', blockedDates: [], blockWeekends: false,
    bankName: '',
    bankBeneficiary: 'COMANE EXCELLENCE SARL',
    bankRib: '',
    hiddenPages: [],
    fontStyle: 'original',
    about: {
      title: 'À Propos de Casa Privilege',
      subtitle: 'Une maison dédiée à l’excellence du service privé.',
      story:
        "Casa Privilege accompagne une clientèle exigeante avec un niveau de discrétion, de précision et d’élégance constant dans chaque interaction.",
      mission:
        "Créer des expériences fluides, humaines et mémorables en combinant expertise locale, standards premium et exécution irréprochable.",
      imageUrl: '',
      visibility: {
        showStory: true,
        showMission: true,
        showContactCard: true,
        showSocials: true,
        showInstagram: true,
        showFacebook: true,
        showLinkedin: true,
        showYoutube: true,
      },
    }
  });
  const [settingsRowId, setSettingsRowId] = useState<number | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>('MAD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(DEFAULT_EXCHANGE_RATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<Theme>('dark');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currency') as Currency | null;
    if (storedCurrency === 'MAD' || storedCurrency === 'EUR' || storedCurrency === 'USD') {
      setCurrency(storedCurrency);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const refreshExchangeRates = useCallback(async () => {
    const rates = await fetchExchangeRates('MAD');
    setExchangeRates(rates);
  }, []);

  useEffect(() => {
    void refreshExchangeRates();
  }, [refreshExchangeRates]);

  useEffect(() => {
    const body = document.body;
    body.classList.remove('font-style-original', 'font-style-playfair', 'font-style-kiona', 'font-style-riona');
    body.classList.add(`font-style-${settings.fontStyle}`);
    console.log('✅ Font style applied:', `font-style-${settings.fontStyle}`);
  }, [settings.fontStyle]);

  useEffect(() => {
    const fetchProfilesSettings = async () => {
      const ordered = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!ordered.error && ordered.data) {
        setProfiles(ordered.data);
      } else {
        const sortErr = ordered.error?.message ?? '';
        const maybeMissingSortCol =
          /created_at|column|42703|does not exist/i.test(sortErr) || ordered.error?.code === '42703';
        if (maybeMissingSortCol) {
          const plain = await supabase.from('profiles').select('*');
          if (!plain.error && plain.data) setProfiles(plain.data);
          else if (ordered.error) {
            console.warn('[Supabase] profiles indisponible:', ordered.error.message);
          }
        } else if (ordered.error) {
          console.warn(
            '[Supabase] profiles indisponible:',
            ordered.error.message,
            '— exécutez fix_profiles_rls.sql dans Supabase si la table ou les politiques RLS sont en cause.'
          );
        }
      }

      const { data: sData, error: sErr } = await supabase
        .from('site_settings')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sErr) console.warn('[Supabase] site_settings:', sErr.message);
      else if (sData) {
        setSettingsRowId((sData as SiteSettingsRow).id ?? null);
        setSettings((prev) => dbRowToSiteSettings(sData as SiteSettingsRow, prev));
      }

      const { data: gsData, error: gsErr } = await supabase.from('global_services').select('*');
      if (gsErr) console.warn('[Supabase] global_services:', gsErr.message);
      else if (gsData && gsData.length > 0) setGlobalServices(gsData);
    };

    const loadCatalogAndOps = async () => {
      const [
        uRes,
        aRes,
        artRes,
        pRes,
        jRes,
        rRes,
        oRes,
        tRes,
        tmRes,
        nsRes,
      ] = await Promise.all([
        supabase.from('universes').select('*'),
        supabase.from('activities').select('*'),
        supabase.from('articles').select('*'),
        supabase.from('products').select('*'),
        supabase.from('journal_posts').select('*'),
        supabase.from('reservations').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
      ]);

      if (uRes.error) console.warn('[Supabase] universes:', uRes.error.message);
      else if (uRes.data?.length) setUniverses(uRes.data.map((row) => rowToUniverse(row)));

      if (aRes.error) console.warn('[Supabase] activities:', aRes.error.message);
      else if (aRes.data?.length) setActivities(aRes.data.map((row) => rowToActivity(row)));

      if (artRes.error) console.warn('[Supabase] articles:', artRes.error.message);
      else if (artRes.data?.length) {
        const mappedArticles = artRes.data.map((row: any) => ({
          id: row.id,
          activityId: row.activity_id,
          title: row.title,
          image: row.image,
          description: row.description,
          priceType: row.price_type,
          price: row.price,
          durationUnit: row.duration_unit,
          pricePerUnit: row.price_per_unit,
          availabilityCount: row.availability_count,
        }));
        setArticles(mappedArticles);
      } else {
        setArticles([]);
      }

      if (pRes.error) console.warn('[Supabase] products:', pRes.error.message);
      else if (pRes.data?.length) setProducts(pRes.data.map((row) => rowToProduct(row)));

      if (jRes.error) console.warn('[Supabase] journal_posts:', jRes.error.message);
      else if (jRes.data?.length) setJournalPosts(jRes.data.map((row) => rowToJournalPost(row)));

      if (rRes.error) console.warn('[Supabase] reservations:', rRes.error.message);
      else if (rRes.data) setReservations(rRes.data.map((row) => dbRowToReservation(row as ReservationRow)));

      if (oRes.error) console.warn('[Supabase] orders:', oRes.error.message);
      else if (oRes.data) setOrders(oRes.data.map((row) => rowToOrder(row)));

      if (tRes.error) console.warn('[Supabase] tickets:', tRes.error.message);
      else if (tRes.data) setTickets(tRes.data as Ticket[]);

      if (tmRes.error) console.warn('[Supabase] testimonials:', tmRes.error.message);
      else if (tmRes.data?.length) setTestimonials(tmRes.data.map((row) => rowToTestimonial(row)));

      if (nsRes.error) console.warn('[Supabase] newsletter_subscribers:', nsRes.error.message);
      else setSubscribers((nsRes.data ?? []).map((row) => rowToSubscriber(row)));
    };

    void Promise.all([fetchProfilesSettings(), loadCatalogAndOps()]);
  }, []);

  const addReservation = async (data: Omit<Reservation, 'id' | 'created_at' | 'status'>) => {
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? `res-${crypto.randomUUID()}`
        : `res-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const row = reservationInputToDbRow(data, id);
    const { data: insertedData, error } = await supabase.from('reservations').insert([row]).select().single();

    if (error) {
      console.error('[Supabase] reservations insert:', error.message, error);
      return;
    }

    if (insertedData) {
      setReservations((prev) => [dbRowToReservation(insertedData as ReservationRow), ...prev]);
    }
  };
  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res));
    await supabase.from('reservations').update({ status }).eq('id', id);
  };
  const deleteReservation = async (id: string) => {
    setReservations(prev => prev.filter(res => res.id !== id));
    await supabase.from('reservations').delete().eq('id', id);
  };

  const addOrder = async (data: Omit<Order, 'id' | 'created_at' | 'status'>) => {
    const { data: inserted, error } = await supabase
      .from('orders')
      .insert({
        customer_email: data.customer_email,
        customer_name: data.customer_name ?? null,
        items: data.items,
        total: data.total,
        receipt_base64: data.receipt_base64 ?? null,
        user_phone: data.user_phone ?? null,
        country: data.country ?? null,
        phone_code: data.phone_code ?? null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase] orders insert:', error.message, error);
      return;
    }
    if (inserted) {
      const o = rowToOrder(inserted);
      setOrders((prev) => [o, ...prev]);
    }
  };
  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await supabase.from('orders').update({ status }).eq('id', id);
  };
  const deleteOrder = async (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    await supabase.from('orders').delete().eq('id', id);
  };

  const addTicket = async (data: Omit<Ticket, 'id' | 'created_at' | 'status'>): Promise<string> => {
    const id = `tic-${Date.now()}`;
    const newT: Ticket = { ...data, id, status: 'open', created_at: new Date().toISOString() };
    setTickets(prev => [newT, ...prev]);
    await supabase.from('tickets').insert(newT);
    return id;
  };
  const updateTicketStatus = async (id: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await supabase.from('tickets').update({ status }).eq('id', id);
  };
  const deleteTicket = async (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    await supabase.from('tickets').delete().eq('id', id);
  };

  const refreshTickets = useCallback(async () => {
    const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (error) console.warn('[Supabase] tickets refresh:', error.message);
    else if (data) setTickets(data as Ticket[]);
  }, []);

  const addTicketMessage = async (data: Omit<TicketMessage, 'id' | 'created_at'>) => {
    const newMsg: TicketMessage = { ...data, id: `msg-${Date.now()}`, created_at: new Date().toISOString() };
    setTicketMessages(prev => [...prev, newMsg]);
    await supabase.from('ticket_messages').insert(newMsg);
  };
  const fetchTicketMessages = useCallback(async (ticketId: string): Promise<TicketMessage[]> => {
    const { data } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    return data || [];
  }, []);

  const addUniverse = async (u: Universe) => {
    setUniverses((prev) => [...prev, u]);
    const { error } = await supabase.from('universes').insert(universeToRow(u));
    if (error) console.error('[Supabase] universes insert:', error.message);
  };
  const updateUniverse = async (u: Universe) => {
    setUniverses((prev) => prev.map((i) => (i.id === u.id ? u : i)));
    const { error } = await supabase.from('universes').update(universeToRow(u)).eq('id', u.id);
    if (error) console.error('[Supabase] universes update:', error.message);
  };
  const deleteUniverse = async (id: string) => {
    setUniverses((prev) => prev.filter((x) => x.id !== id));
    const { error } = await supabase.from('universes').delete().eq('id', id);
    if (error) console.error('[Supabase] universes delete:', error.message);
  };

  const addActivity = async (a: Activity) => {
    setActivities((prev) => [...prev, a]);
    const { error } = await supabase.from('activities').insert(activityToRow(a));
    if (error) console.error('[Supabase] activities insert:', error.message);
  };
  const updateActivity = async (a: Activity) => {
    setActivities((prev) => prev.map((i) => (i.id === a.id ? a : i)));
    const { error } = await supabase.from('activities').update(activityToRow(a)).eq('id', a.id);
    if (error) console.error('[Supabase] activities update:', error.message);
  };
  const deleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((x) => x.id !== id));
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) console.error('[Supabase] activities delete:', error.message);
  };

  const addArticle = async (a: Article) => {
    setArticles((prev) => [...prev, a]);
    const row = {
      id: a.id,
      activity_id: a.activityId,
      title: a.title,
      image: a.image,
      description: a.description,
      price_type: a.priceType,
      price: a.price,
      duration_unit: a.durationUnit,
      price_per_unit: a.pricePerUnit,
      availability_count: a.availabilityCount,
    };
    const { error } = await supabase.from('articles').insert([row]);
    if (error) console.error('[Supabase] articles insert:', error.message);
  };

  const updateArticle = async (a: Article) => {
    setArticles((prev) => prev.map((i) => (i.id === a.id ? a : i)));
    const row = {
      id: a.id,
      activity_id: a.activityId,
      title: a.title,
      image: a.image,
      description: a.description,
      price_type: a.priceType,
      price: a.price,
      duration_unit: a.durationUnit,
      price_per_unit: a.pricePerUnit,
      availability_count: a.availabilityCount,
    };
    const { error } = await supabase.from('articles').update(row).eq('id', a.id);
    if (error) console.error('[Supabase] articles update:', error.message);
  };

  const deleteArticle = async (id: string) => {
    setArticles((prev) => prev.filter((x) => x.id !== id));
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) console.error('[Supabase] articles delete:', error.message);
  };

  const getArticlesByActivityId = (activityId: string) => {
    return articles.filter((a) => a.activityId === activityId);
  };

  const addProduct = async (p: Product) => {
    setProducts((prev) => [...prev, p]);
    const { error } = await supabase.from('products').insert(productToRow(p));
    if (error) console.error('[Supabase] products insert:', error.message);
  };
  const updateProduct = async (p: Product) => {
    setProducts((prev) => prev.map((i) => (i.id === p.id ? p : i)));
    const { error } = await supabase.from('products').update(productToRow(p)).eq('id', p.id);
    if (error) console.error('[Supabase] products update:', error.message);
  };
  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error('[Supabase] products delete:', error.message);
  };

  const addJournalPost = async (p: JournalPost) => { setJournalPosts(prev => [...prev,p]); await supabase.from('journal_posts').insert(p); };
  const updateJournalPost = async (p: JournalPost) => { setJournalPosts(prev => prev.map(i => i.id === p.id ? p : i)); await supabase.from('journal_posts').update(p).eq('id', p.id); };
  const deleteJournalPost = async (id: string) => { setJournalPosts(prev => prev.filter(p => p.id !== id)); await supabase.from('journal_posts').delete().eq('id', id); };

  const addGlobalService = async (s: GlobalService) => { setGlobalServices(prev => [...prev, s]); await supabase.from('global_services').insert(s); };
  const updateGlobalService = async (s: GlobalService) => { 
    setGlobalServices(prev => prev.map(item => item.id === s.id ? s : item)); 
    const { error } = await supabase.from('global_services').upsert(s, { onConflict: 'id' });
    if (error) console.error('Error saving service:', error);
  };
  const deleteGlobalService = async (id: string) => { setGlobalServices(prev => prev.filter(s => s.id !== id)); await supabase.from('global_services').delete().eq('id', id); };

  const addTestimonial = async (t: Omit<Testimonial, 'id' | 'isApproved'>) => {
    const newT: Testimonial = { ...t, id: `t-${Date.now()}`, isApproved: false };
    setTestimonials((prev) => [newT, ...prev]);
    const { error } = await supabase.from('testimonials').insert(testimonialToRow(newT));
    if (error) console.error('[Supabase] testimonials insert:', error.message);
  };
  const updateTestimonial = async (t: Testimonial) => {
    setTestimonials((prev) => prev.map((i) => (i.id === t.id ? t : i)));
    const { error } = await supabase.from('testimonials').update(testimonialToRow(t)).eq('id', t.id);
    if (error) console.error('[Supabase] testimonials update:', error.message);
  };
  const deleteTestimonial = async (id: string) => { setTestimonials(prev => prev.filter(t => t.id !== id)); await supabase.from('testimonials').delete().eq('id', id); };

  const subscribeNewsletter = async (email: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return false;
    if (subscribers.some((s) => s.email.toLowerCase() === trimmed)) return true;

    const { data, error } = await supabase.from('newsletter_subscribers').insert({ email: trimmed }).select().single();

    if (error) {
      if (error.code === '23505') return true;
      console.error('[Supabase] newsletter_subscribers insert:', error.message);
      return false;
    }
    if (data) setSubscribers((prev) => [rowToSubscriber(data), ...prev]);
    return true;
  };

  const unsubscribeNewsletter = async (id: string) => {
    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
    if (error) console.error('[Supabase] newsletter_subscribers delete:', error.message);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  const refreshNewsletterSubscribers = useCallback(async () => {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    if (error) {
      console.error('[Supabase] newsletter_subscribers refresh:', error.message);
      throw error;
    }
    setSubscribers((data ?? []).map((row) => rowToSubscriber(row)));
  }, []);

  const updateSettings = async (s: SiteSettings) => {
    console.log('📝 Updating settings with fontStyle:', s.fontStyle);
    const rowId = settingsRowId ?? 1;
    const row = siteSettingsToDbRow(s, rowId);
    console.log('📊 Upserting to Supabase:', row);
    let { error } = await supabase.from('site_settings').upsert(row, { onConflict: 'id' });

    if (error) {
      const missingColumn = /Could not find the 'block_weekends' column/i.test(error.message);
      if (missingColumn) {
        const retryRow = { ...row };
        delete (retryRow as any).block_weekends;
        console.warn('[Supabase] block_weekends column missing, retrying without it.');
        const retry = await supabase.from('site_settings').upsert(retryRow, { onConflict: 'id' });
        error = retry.error;
      }
    }

    if (error) {
      console.error('[Supabase] site_settings:', error.message, error);
      return;
    }

    setSettings(s);
    console.log('✅ Settings saved successfully to Supabase');
  };

  const addToCart = (p: Product) => setCart(prev => [...prev, p]);
  const removeFromCart = (id: string) => setCart(prev => prev.filter(p => p.id !== id));
  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const deleteProfile = async (id: string) => {
    await supabase.from('profiles').delete().eq('id', id);
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{ 
      reservations, addReservation, updateReservationStatus, deleteReservation,
      orders, addOrder, updateOrderStatus, deleteOrder,
      tickets, refreshTickets, addTicket, updateTicketStatus, deleteTicket,
      ticketMessages, addTicketMessage, fetchTicketMessages,
      universes, addUniverse, updateUniverse, deleteUniverse,
      activities, addActivity, updateActivity, deleteActivity,
      articles, addArticle, updateArticle, deleteArticle, getArticlesByActivityId,
      products, addProduct, updateProduct, deleteProduct,
      journalPosts, addJournalPost, updateJournalPost, deleteJournalPost,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      globalServices, addGlobalService, updateGlobalService, deleteGlobalService,
      subscribers, subscribeNewsletter, unsubscribeNewsletter, refreshNewsletterSubscribers,
      settings, updateSettings,
      cart, addToCart, removeFromCart,
      favorites, toggleFavorite,
      currency, setCurrency, exchangeRates, refreshExchangeRates,
      searchQuery, setSearchQuery,
      profiles, deleteProfile,
      theme, toggleTheme,
      language, setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
