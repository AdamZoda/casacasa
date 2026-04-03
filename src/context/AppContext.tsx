import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { universes as initialUniverses, journalPosts as initialJournalPosts } from '../data/content';
import { Language } from '../i18n/translations';

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
  setSearchQuery: (query: string) => void;

  theme: Theme;
  toggleTheme: () => void;

  language: Language;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initUniverses = Object.values(initialUniverses).map(u => ({
  id: u.id, name: u.name, flag: u.flag, location: u.location, description: u.description, heroImage: u.heroImage, gallery: u.gallery
}));

const initActivities = Object.values(initialUniverses).flatMap(u => 
  u.activities.map(a => ({ ...a, universeId: u.id }))
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [universes, setUniverses] = useState<Universe[]>(initUniverses);
  const [activities, setActivities] = useState<Activity[]>(initActivities);
  const [products, setProducts] = useState<Product[]>(initProducts);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>(initialJournalPosts);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 't-1',
      name: 'Alexander Rossi',
      role: 'CEO, Global Tech',
      content: 'Casa Privilege a transformé ma vision du luxe. Leur attention aux détails est inégalée.',
      rating: 5,
      isApproved: true
    },
    {
      id: 't-2',
      name: 'Elena Vance',
      role: 'Art Collector',
      content: 'Une expérience transcendante. Chaque service est une œuvre d\'art en soi.',
      rating: 5,
      isApproved: true
    }
  ]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Casa Privilege',
    contactEmail: 'contact@casaprivilege.com',
    phone: '+212 5XX XX XX XX',
    address: 'Marrakech, Maroc',
    socialLinks: {
      instagram: 'https://instagram.com/casaprivilege',
      facebook: 'https://facebook.com/casaprivilege',
      linkedin: 'https://linkedin.com/company/casaprivilege'
    },
    maintenanceMode: false
  });
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addReservation = (data: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const newRes: Reservation = {
      ...data,
      id: `res-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReservations(prev => [newRes, ...prev]);
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res));
  };

  const deleteReservation = (id: string) => setReservations(prev => prev.filter(res => res.id !== id));

  const addUniverse = (u: Universe) => setUniverses(prev => [...prev, u]);
  const updateUniverse = (u: Universe) => setUniverses(prev => prev.map(item => item.id === u.id ? u : item));
  const deleteUniverse = (id: string) => {
    setUniverses(prev => prev.filter(u => u.id !== id));
    setActivities(prev => prev.filter(a => a.universeId !== id));
  };

  const addActivity = (a: Activity) => setActivities(prev => [...prev, a]);
  const updateActivity = (a: Activity) => setActivities(prev => prev.map(item => item.id === a.id ? a : item));
  const deleteActivity = (id: string) => setActivities(prev => prev.filter(a => a.id !== id));
  
  const addProduct = (p: Product) => setProducts(prev => [...prev, p]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addJournalPost = (p: JournalPost) => setJournalPosts(prev => [...prev, p]);
  const updateJournalPost = (p: JournalPost) => setJournalPosts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteJournalPost = (id: string) => setJournalPosts(prev => prev.filter(p => p.id !== id));

  const addTestimonial = (t: Omit<Testimonial, 'id' | 'isApproved'>) => {
    const newT: Testimonial = { ...t, id: `t-${Date.now()}`, isApproved: false };
    setTestimonials(prev => [newT, ...prev]);
  };
  const updateTestimonial = (t: Testimonial) => setTestimonials(prev => prev.map(item => item.id === t.id ? t : item));
  const deleteTestimonial = (id: string) => setTestimonials(prev => prev.filter(t => t.id !== id));

  const subscribeNewsletter = (email: string) => {
    if (subscribers.find(s => s.email === email)) return;
    const newS: NewsletterSubscriber = { id: `s-${Date.now()}`, email, subscribedAt: new Date().toISOString() };
    setSubscribers(prev => [newS, ...prev]);
  };
  const unsubscribeNewsletter = (id: string) => setSubscribers(prev => prev.filter(s => s.id !== id));

  const updateSettings = (s: SiteSettings) => setSettings(s);

  const addToCart = (p: Product) => setCart(prev => [...prev, p]);
  const removeFromCart = (id: string) => setCart(prev => prev.filter(p => p.id !== id));

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider value={{ 
      reservations, addReservation, updateReservationStatus, deleteReservation,
      universes, addUniverse, updateUniverse, deleteUniverse,
      activities, addActivity, updateActivity, deleteActivity,
      products, addProduct, updateProduct, deleteProduct,
      journalPosts, addJournalPost, updateJournalPost, deleteJournalPost,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      subscribers, subscribeNewsletter, unsubscribeNewsletter,
      settings, updateSettings,
      cart, addToCart, removeFromCart,
      favorites, toggleFavorite,
      searchQuery, setSearchQuery,
      theme, toggleTheme,
      language, setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
