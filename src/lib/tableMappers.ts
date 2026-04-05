import type {
  Activity,
  JournalPost,
  NewsletterSubscriber,
  Order,
  Product,
  Reservation,
  Testimonial,
  Universe,
} from '../context/AppContext';

/** Ligne `universes` (snake_case Postgres). */
export type UniverseRow = Record<string, unknown>;
/** Ligne `activities`. */
export type ActivityRow = Record<string, unknown>;
/** Ligne `products`. */
export type ProductRow = Record<string, unknown>;
/** Ligne `testimonials`. */
export type TestimonialRow = Record<string, unknown>;
/** Ligne `reservations`. */
export type ReservationRow = Record<string, unknown>;

export function universeToRow(u: Universe): Record<string, unknown> {
  return {
    id: u.id,
    name: u.name,
    flag: u.flag,
    location: u.location,
    description: u.description,
    hero_image: u.heroImage,
    gallery: u.gallery,
  };
}

export function rowToUniverse(row: UniverseRow): Universe {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    flag: String(row.flag ?? ''),
    location: String(row.location ?? ''),
    description: String(row.description ?? ''),
    heroImage: String(row.hero_image ?? (row as { heroImage?: string }).heroImage ?? ''),
    gallery: Array.isArray(row.gallery) ? (row.gallery as unknown[]).map(String) : [],
  };
}

export function activityToRow(a: Activity): Record<string, unknown> {
  return {
    id: a.id,
    universe_id: a.universeId,
    title: a.title,
    category: a.category ?? null,
    price: a.price ?? null,
    image: a.image ?? null,
    description: a.description ?? null,
    min_advance_days: a.minAdvanceDays ?? 0,
  };
}

export function rowToActivity(row: ActivityRow): Activity {
  const mad = row.min_advance_days ?? (row as { minAdvanceDays?: number }).minAdvanceDays;
  const n = typeof mad === 'number' ? mad : Number(mad) || 0;
  return {
    id: String(row.id),
    universeId: String(row.universe_id ?? (row as { universeId?: string }).universeId ?? ''),
    title: String(row.title ?? ''),
    category: String(row.category ?? ''),
    price: String(row.price ?? ''),
    image: String(row.image ?? ''),
    description: String(row.description ?? ''),
    minAdvanceDays: n,
  };
}

export function productToRow(p: Product): Record<string, unknown> {
  return {
    id: p.id,
    title: p.title,
    category: p.category ?? null,
    price: p.price,
    old_price: p.oldPrice ?? null,
    image: p.image ?? null,
    description: p.description ?? null,
    is_exclusive: p.isExclusive ?? false,
  };
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    category: String(row.category ?? ''),
    price: Number(row.price ?? 0),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    image: String(row.image ?? ''),
    description: String(row.description ?? ''),
    isExclusive: Boolean(row.is_exclusive ?? (row as { isExclusive?: boolean }).isExclusive),
  };
}

export function rowToJournalPost(row: Record<string, unknown>): JournalPost {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    category: String(row.category ?? ''),
    date: String(row.date ?? ''),
    image: String(row.image ?? ''),
    excerpt: String(row.excerpt ?? ''),
    content: String(row.content ?? ''),
  };
}

export function testimonialToRow(t: Testimonial): Record<string, unknown> {
  return {
    id: t.id,
    name: t.name,
    role: t.role ?? null,
    content: t.content,
    rating: t.rating,
    image: t.image ?? null,
    is_approved: t.isApproved,
  };
}

export function rowToTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    role: String(row.role ?? ''),
    content: String(row.content ?? ''),
    rating: Number(row.rating ?? 0),
    image: row.image != null ? String(row.image) : undefined,
    isApproved: Boolean(row.is_approved ?? (row as { isApproved?: boolean }).isApproved),
  };
}

export function rowToSubscriber(row: Record<string, unknown>): NewsletterSubscriber {
  return {
    id: String(row.id),
    email: String(row.email ?? ''),
    subscribedAt: String(row.subscribed_at ?? (row as { subscribedAt?: string }).subscribedAt ?? ''),
  };
}

export function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    customer_name: String(row.customer_name ?? ''),
    customer_email: String(row.customer_email ?? ''),
    total: Number(row.total ?? 0),
    items: Array.isArray(row.items) ? (row.items as unknown[]) : [],
    status: (row.status as Order['status']) || 'pending',
    created_at: String(row.created_at ?? ''),
  };
}

/** Données formulaire → colonnes `reservations`. */
export function reservationInputToDbRow(
  data: Omit<Reservation, 'id' | 'created_at' | 'status'>,
  id: string
): Record<string, unknown> {
  return {
    id,
    activity_id: data.activity_id || null,
    activity_title: data.activity_title || null,
    universe_id: data.universe_id || null,
    selected_date: data.date,
    selected_time: data.time,
    user_name: data.name,
    user_email: data.email ?? null,
    country: data.country ?? null,
    phone_code: data.phone_code ?? null,
    user_phone: data.phone ?? null,
    contact: data.contact,
    message: data.message ?? null,
    channel: data.channel,
    end_date: data.end_date ?? null,
    people_count: data.people_count ?? null,
    total_price: data.total_price ?? null,
    receipt_base64: data.receipt_base64 ?? null,
    status: 'pending',
  };
}

export function dbRowToReservation(row: ReservationRow): Reservation {
  const selDate = row.selected_date ?? row.date;
  const selTime = row.selected_time ?? row.time;
  const uName = row.user_name ?? row.name;
  return {
    id: String(row.id),
    activity_id: String(row.activity_id ?? ''),
    activity_title: String(row.activity_title ?? ''),
    universe_id: String(row.universe_id ?? ''),
    date: String(selDate ?? ''),
    end_date: row.end_date != null ? String(row.end_date) : undefined,
    time: String(selTime ?? ''),
    name: String(uName ?? ''),
    country: row.country != null ? String(row.country) : undefined,
    phone_code: row.phone_code != null ? String(row.phone_code) : undefined,
    phone:
      row.user_phone != null
        ? String(row.user_phone)
        : row.phone != null
          ? String(row.phone)
          : undefined,
    email:
      row.user_email != null
        ? String(row.user_email)
        : row.email != null
          ? String(row.email)
          : undefined,
    contact: String(row.contact ?? ''),
    people_count: typeof row.people_count === 'number' ? row.people_count : undefined,
    total_price: row.total_price != null ? Number(row.total_price) : undefined,
    receipt_base64: row.receipt_base64 != null ? String(row.receipt_base64) : undefined,
    status: (row.status as Reservation['status']) || 'pending',
    channel: (row.channel as Reservation['channel']) || 'web',
    message: row.message != null ? String(row.message) : undefined,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}
