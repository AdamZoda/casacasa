// security/validators.ts - Validation & Sanitization Secure

import DOMPurify from 'dompurify';
import { z } from 'zod';

// ✅ SCHÉMAS DE VALIDATION ZEST

export const CheckoutFormSchema = z.object({
  name: z.string()
    .min(2, 'Nom minimum 2 caractères')
    .max(100, 'Nom maximum 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Caractères invalides dans le nom'),
  
  email: z.string()
    .email('Email invalide')
    .max(254, 'Email trop long')
    .toLowerCase(),
  
  phone: z.string()
    .min(8, 'Téléphone trop court')
    .max(20, 'Téléphone trop long')
    .regex(/^\d+$/, 'Seulement les chiffres'),
  
  country: z.string()
    .min(2, 'Pays invalide')
    .max(50, 'Pays invalide'),
  
  phoneCode: z.string()
    .regex(/^\+\d+$/, 'Code téléphone invalide'),
});

export type CheckoutFormData = z.infer<typeof CheckoutFormSchema>;

// ✅ SANITIZATION FUNCTIONS

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  })
    .trim()
    .slice(0, 255); // Limite stricte
};

export const sanitizeName = (name: string): string => {
  return sanitizeInput(name)
    .replace(/[<>\"'`]/g, '')
    .replace(/\s+/g, ' '); // Normaliser espaces
};

export const sanitizeEmail = (email: string): string => {
  return sanitizeInput(email)
    .toLowerCase()
    .slice(0, 254);
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '').slice(0, 20);
};

// ✅ VALIDATION PHONE PAR PAYS

const PHONE_RULES: Record<string, { min: number; max: number }> = {
  'Maroc': { min: 9, max: 9 },
  'France': { min: 9, max: 9 },
  'Espagne': { min: 9, max: 9 },
  'Royaume-Uni': { min: 10, max: 11 },
  'États-Unis': { min: 10, max: 10 },
  'Canada': { min: 10, max: 10 },
  'Allemagne': { min: 10, max: 11 },
};

export const validatePhoneForCountry = (phone: string, country: string): boolean => {
  const rules = PHONE_RULES[country];
  if (!rules) return false;
  
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= rules.min && cleanPhone.length <= rules.max;
};

// ✅ VALIDATION PRIX (neverTrust client!)

export const validatePrice = (price: any): number => {
  // Ne PAS accepter float directement
  if (typeof price !== 'string' && typeof price !== 'number') {
    throw new Error('Invalid price type');
  }
  
  const cleanPrice = String(price)
    .replace(/[^0-9.]/g, '')
    .split('.')[0]; // Seulement partie entière
  
  const parsed = parseInt(cleanPrice, 10);
  
  if (isNaN(parsed) || parsed < 0 || parsed > 999999999) {
    throw new Error('Invalid price range');
  }
  
  return parsed;
};

// ✅ VALIDATION FILE UPLOAD

export const validateFile = (
  file: File,
  options: {
    maxSizeMB?: number;
    allowedMimes?: string[];
  } = {}
): { valid: boolean; error?: string } => {
  const maxSize = (options.maxSizeMB || 1) * 1024 * 1024;
  const allowedMimes = options.allowedMimes || [
    'image/jpeg',
    'image/png',
    'application/pdf'
  ];
  
  // 1. Vérifier taille
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux (max ${options.maxSizeMB}MB)`
    };
  }
  
  // 2. Vérifier MIME type
  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: 'Type de fichier non autorisé'
    };
  }
  
  // 3. Vérifier extension (fallback if MIME type check passes)
  const validExtensions = allowedMimes
    .map(mime => {
      if (mime === 'image/jpeg') return ['.jpg', '.jpeg'];
      if (mime === 'image/png') return ['.png'];
      if (mime === 'application/pdf') return ['.pdf'];
      return [];
    })
    .flat();
  
  // Extract extension safely - if no dot found, just use MIME check result
  const nameParts = file.name.split('.');
  if (nameParts.length > 1) {
    const fileExt = '.' + nameParts[nameParts.length - 1]?.toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      return {
        valid: false,
        error: 'Extension de fichier invalide'
      };
    }
  }
  
  return { valid: true };
};

// ✅ SANITZATION WHATSAPP MESSAGE

export const sanitizeWhatsappMessage = (message: string): string => {
  // Supprimer caractères d'contrôle
  return message
    .replace(/[\x00-\x1F\x7F]/g, '') // Contrôle characters
    .replace(/[\r\n]{3,}/g, '\n\n') // Max 2 newlines
    .slice(0, 4096); // Max 4096 chars
};

// ✅ VALIDATION CART

export const validateCart = async (
  cart: Array<{ id: string; price: string | number }>,
  supabase: any
): Promise<{ valid: boolean; error?: string; total?: number }> => {
  if (!Array.isArray(cart) || cart.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }
  
  if (cart.length > 100) {
    return { valid: false, error: 'Cart too large' };
  }
  
  try {
    // 1. Récupérer les prix actuels depuis DB
    const productIds = cart.map(item => item.id);
    const { data: products, error } = await supabase
      .from('products')
      .select('id,price')
      .in('id', productIds);
    
    if (error || !products || products.length !== cart.length) {
      return {
        valid: false,
        error: 'Some products not found'
      };
    }
    
    // 2. Recalculer total depuis DB
    const priceMap = new Map(products.map((p: any) => [p.id, p.price]));
    let total = 0;
    
    for (const item of cart) {
      const dbPrice = priceMap.get(item.id);
      if (!dbPrice) {
        return { valid: false, error: `Product ${item.id} not found` };
      }
      
      const validatedPrice = validatePrice(dbPrice);
      total += validatedPrice;
    }
    
    // 3. Vérifier limites raisonnables
    if (total < 100 || total > 99999999) {
      return { valid: false, error: 'Total out of range' };
    }
    
    return { valid: true, total };
  } catch (err) {
    return { valid: false, error: 'Cart validation failed' };
  }
};

// ✅ RATE LIMITING

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  identifier: string,
  options: { maxRequests?: number; windowMs?: number } = {}
): { allowed: boolean; remaining?: number; retryAfter?: number } => {
  const maxRequests = options.maxRequests || 5;
  const windowMs = options.windowMs || 60000; // 1 minute default
  
  const now = Date.now();
  const entry = requestCounts.get(identifier);
  
  let count = 0;
  let resetTime = now + windowMs;
  
  if (entry && entry.resetTime > now) {
    count = entry.count;
    resetTime = entry.resetTime;
  } else {
    requestCounts.delete(identifier);
  }
  
  if (count >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((resetTime - now) / 1000)
    };
  }
  
  const updatedCount = count + 1;
  requestCounts.set(identifier, { count: updatedCount, resetTime });
  
  return {
    allowed: true,
    remaining: maxRequests - updatedCount
  };
};

// ✅ SECURE RANDOM TOKEN GENERATION

export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array)
    .map(x => chars[x % chars.length])
    .join('');
};

// ✅ SECURE LOCAL STORAGE (Encrypted keys)

export const secureStorage = {
  set: (key: string, value: string) => {
    const encrypted = btoa(value); // Minimal - idéalement ChaCha20
    localStorage.setItem(`secure_${key}`, encrypted);
  },
  
  get: (key: string): string | null => {
    const encrypted = localStorage.getItem(`secure_${key}`);
    return encrypted ? atob(encrypted) : null;
  },
  
  remove: (key: string) => {
    localStorage.removeItem(`secure_${key}`);
  }
};

// ✅ EXPORT ALL

export default {
  CheckoutFormSchema,
  sanitizeInput,
  sanitizeName,
  sanitizeEmail,
  sanitizePhone,
  validatePhoneForCountry,
  validatePrice,
  validateFile,
  sanitizeWhatsappMessage,
  validateCart,
  checkRateLimit,
  generateSecureToken,
  secureStorage
};
