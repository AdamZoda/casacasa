import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { universes as initialUniverses, journalPosts as initialJournalPosts } from '../data/content';
import { Language } from '../i18n/translations';
import { supabase } from '../lib/supabase';

export interface Reservation {
  id: string;
  activityId: string;
  activityTitle: string;
  universeId: string;
  date: string;
  time: string;
  name: string;
  contact: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  channel: 'web' | 'whatsapp';
  createdAt: string;
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

export interface Activity {
  id: string;
  universeId: string;
  title: string;
  category: string;
  price: string;
  image: string;
  description: string;
  minAdvanceDays?: number;
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

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  maintenanceMode: boolean;
  heroBackgroundUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  brandGoldColor: string;
  whatsappNumber: string;
  logoText: string;
  footerTitle: string;
  footerCta: string;
  blockedDates: string[];
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

export interface GlobalService {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export type Theme = 'light' | 'dark';

interface AppContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  deleteReservation: (id: string) => void;
  
  universes: Universe[];
  addUniverse: (u: Universe) => void;
  updateUniverse: (u: Universe) => void;
  deleteUniverse: (id: string) => void;
  
  activities: Activity[];
  addActivity: (a: Activity) => void;
  updateActivity: (a: Activity) => void;
  deleteActivity: (id: string) => void;

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
  subscribeNewsletter: (email: string) => void;
  unsubscribeNewsletter: (id: string) => void;

  settings: SiteSettings;
  updateSettings: (s: SiteSettings) => void;

  cart: Product[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;

  favorites: string[];
  toggleFavorite: (id: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  profiles: Profile[];
  updateProfileRole: (id: string, role: string) => void;
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
  const [universes, setUniverses] = useState<Universe[]>(initUniverses);
  const [activities, setActivities] = useState<Activity[]>(initActivities);
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
    phone: '',
    address: 'Marrakech, Maroc',
    socialLinks: { instagram: '', facebook: '', linkedin: '' },
    maintenanceMode: false,
    heroBackgroundUrl: '',
    heroTitle: '', heroSubtitle: '', heroCta: '', brandGoldColor: '#E5A93A', whatsappNumber: '', logoText: 'CASA PRIVILEGE', footerTitle: '', footerCta: '', blockedDates: []
  });
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<Theme>('dark');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: pData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (pData) setProfiles(pData);
      const { data: sData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (sData) setSettings(prev => ({ ...prev, ...sData }));
      const { data: gsData } = await supabase.from('global_services').select('*');
      if (gsData && gsData.length > 0) setGlobalServices(gsData);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    async function loadData() {
      const { data: u } = await supabase.from('universes').select('*');
      if (u && u.length > 0) setUniverses(u);
      const { data: a } = await supabase.from('activities').select('*');
      if (a && a.length > 0) setActivities(a);
      const { data: p } = await supabase.from('products').select('*');
      if (p && p.length > 0) setProducts(p);
      const { data: j } = await supabase.from('journal_posts').select('*');
      if (j && j.length > 0) setJournalPosts(j);
    }
    loadData();
  }, []);

  const addReservation = (data: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const newRes: Reservation = { ...data, id: `res-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() };
    setReservations(prev => [newRes, ...prev]);
  };
  const updateReservationStatus = (id: string, status: Reservation['status']) => setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res));
  const deleteReservation = (id: string) => setReservations(prev => prev.filter(res => res.id !== id));

  const addUniverse = async (u: Universe) => { setUniverses(prev => [...prev,u]); await supabase.from('universes').insert(u); };
  const updateUniverse = async (u: Universe) => { setUniverses(prev => prev.map(i => i.id === u.id ? u : i)); await supabase.from('universes').update(u).eq('id', u.id); };
  const deleteUniverse = async (id: string) => { setUniverses(prev => prev.filter(u => u.id !== id)); await supabase.from('universes').delete().eq('id', id); };

  const addActivity = async (a: Activity) => { setActivities(prev => [...prev,a]); await supabase.from('activities').insert(a); };
  const updateActivity = async (a: Activity) => { setActivities(prev => prev.map(i => i.id === a.id ? a : i)); await supabase.from('activities').update(a).eq('id', a.id); };
  const deleteActivity = async (id: string) => { setActivities(prev => prev.filter(a => a.id !== id)); await supabase.from('activities').delete().eq('id', id); };

  const addProduct = async (p: Product) => { setProducts(prev => [...prev,p]); await supabase.from('products').insert(p); };
  const updateProduct = async (p: Product) => { setProducts(prev => prev.map(i => i.id === p.id ? p : i)); await supabase.from('products').update(p).eq('id', p.id); };
  const deleteProduct = async (id: string) => { setProducts(prev => prev.filter(p => p.id !== id)); await supabase.from('products').delete().eq('id', id); };

  const addJournalPost = async (p: JournalPost) => { setJournalPosts(prev => [...prev,p]); await supabase.from('journal_posts').insert(p); };
  const updateJournalPost = async (p: JournalPost) => { setJournalPosts(prev => prev.map(i => i.id === p.id ? p : i)); await supabase.from('journal_posts').update(p).eq('id', p.id); };
  const deleteJournalPost = async (id: string) => { setJournalPosts(prev => prev.filter(p => p.id !== id)); await supabase.from('journal_posts').delete().eq('id', id); };

  const addGlobalService = async (s: GlobalService) => { setGlobalServices(prev => [...prev, s]); await supabase.from('global_services').insert(s); };
  const updateGlobalService = async (s: GlobalService) => { 
    setGlobalServices(prev => prev.map(item => item.id === s.id ? s : item)); 
    const { error } = await supabase.from('global_services').upsert(s);
    if (error) console.error('Error saving service:', error);
  };
  const deleteGlobalService = async (id: string) => { setGlobalServices(prev => prev.filter(s => s.id !== id)); await supabase.from('global_services').delete().eq('id', id); };

  const addTestimonial = async (t: Omit<Testimonial, 'id' | 'isApproved'>) => {
    const newT = { ...t, id: `t-${Date.now()}`, isApproved: false };
    setTestimonials(prev => [newT, ...prev]);
    await supabase.from('testimonials').insert(newT);
  };
  const updateTestimonial = async (t: Testimonial) => { setTestimonials(prev => prev.map(i => i.id === t.id ? t : i)); await supabase.from('testimonials').update(t).eq('id', t.id); };
  const deleteTestimonial = async (id: string) => { setTestimonials(prev => prev.filter(t => t.id !== id)); await supabase.from('testimonials').delete().eq('id', id); };

  const subscribeNewsletter = (email: string) => {
    if (!subscribers.find(s => s.email === email)) {
      const newS = { id: `s-${Date.now()}`, email, subscribedAt: new Date().toISOString() };
      setSubscribers(prev => [newS, ...prev]);
    }
  };
  const unsubscribeNewsletter = (id: string) => setSubscribers(prev => prev.filter(s => s.id !== id));

  const updateSettings = async (s: SiteSettings) => {
    setSettings(s);
    await supabase.from('site_settings').upsert({ id: 1, ...s });
  };

  const addToCart = (p: Product) => setCart(prev => [...prev, p]);
  const removeFromCart = (id: string) => setCart(prev => prev.filter(p => p.id !== id));
  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const updateProfileRole = async (id: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', id);
    setProfiles(profiles.map(p => p.id === id ? { ...p, role } : p));
  };
  const deleteProfile = async (id: string) => {
    await supabase.from('profiles').delete().eq('id', id);
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{ 
      reservations, addReservation, updateReservationStatus, deleteReservation,
      universes, addUniverse, updateUniverse, deleteUniverse,
      activities, addActivity, updateActivity, deleteActivity,
      products, addProduct, updateProduct, deleteProduct,
      journalPosts, addJournalPost, updateJournalPost, deleteJournalPost,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      globalServices, addGlobalService, updateGlobalService, deleteGlobalService,
      subscribers, subscribeNewsletter, unsubscribeNewsletter,
      settings, updateSettings,
      cart, addToCart, removeFromCart,
      favorites, toggleFavorite,
      searchQuery, setSearchQuery,
      profiles, updateProfileRole, deleteProfile,
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
