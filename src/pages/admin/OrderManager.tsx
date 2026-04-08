import { useCallback, useEffect, useMemo, useState, useDeferredValue } from "react";
import { useAppContext, type Order } from "../../context/AppContext";
import {
  Package,
  Search,
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminStatusPill, adminOrderStatusTone } from "../../components/admin/adminShared";

const STATUS_FILTERS = [
  { id: "all" as const, label: "Tous" },
  { id: "pending" as const, label: "En attente" },
  { id: "completed" as const, label: "Terminées" },
  { id: "cancelled" as const, label: "Annulées" },
];

function orderDisplayRef(id: string): { badge: string; full: string } {
  const full = String(id);
  const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(full);
  if (uuidLike) {
    const second = full.split("-")[1] ?? full.slice(9, 13);
    return { badge: `#${second.toLowerCase()}`, full };
  }
  if (full.startsWith("ord-")) {
    const rest = full.slice(4);
    return { badge: `#${rest.slice(0, 8)}${rest.length > 8 ? "…" : ""}`, full };
  }
  return { badge: `#${full.slice(0, 8)}${full.length > 8 ? "…" : ""}`, full };
}

function formatOrderDate(iso: string | undefined): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatMoneyMAD(n: number): string {
  return `${Number(n || 0).toLocaleString("fr-FR")} MAD`;
}

export function OrderManager() {
  const { orders, updateOrderStatus, deleteOrder } = useAppContext();
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]["id"]>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const q = searchTerm.trim().toLowerCase();
  const deferredQ = useDeferredValue(q);
  const searchPending = q !== deferredQ;

  const filteredOrders = useMemo(() => {
    if (!deferredQ && filter === "all") return orders;
    return orders.filter((order) => {
      const name = (order.customer_name ?? "").toLowerCase();
      const email = (order.customer_email ?? "").toLowerCase();
      const id = String(order.id ?? "").toLowerCase();
      const { badge, full } = orderDisplayRef(String(order.id));
      const matchesSearch =
        !deferredQ ||
        name.includes(deferredQ) ||
        email.includes(deferredQ) ||
        id.includes(deferredQ) ||
        badge.replace("#", "").includes(deferredQ) ||
        full.toLowerCase().includes(deferredQ);
      const matchesFilter = filter === "all" || order.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [orders, deferredQ, filter]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyOrderId = useCallback(async (fullId: string) => {
    try {
      await navigator.clipboard.writeText(fullId);
      setCopiedId(fullId);
      window.setTimeout(() => {
        setCopiedId((cur) => (cur === fullId ? null : cur));
      }, 2000);
    } catch {
      /* navigateur sans presse-papiers */
    }
  }, []);

  const statusIcon = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 aria-hidden />;
      case "cancelled":
        return <XCircle aria-hidden />;
      default:
        return <Clock aria-hidden />;
    }
  };

  const closeModal = useCallback(() => setSelectedOrder(null), []);

  useEffect(() => {
    if (!selectedOrder) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedOrder, closeModal]);

  const statusLabelFr: Record<Order["status"], string> = {
    pending: "En attente",
    completed: "Terminée",
    cancelled: "Annulée",
  };

  return (
    <div className="space-y-8 pb-12 md:pb-16">
      <p className="sr-only" aria-live="polite">
        {copiedId ? "Identifiant copié dans le presse-papiers." : ""}
      </p>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="h-px w-16 bg-brand-gold/80 mb-6 origin-left" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-3 flex flex-wrap items-center gap-3">
            <span className="text-balance">Gestion des commandes boutique</span>
            <span className="text-xs font-sans font-black bg-brand-gold/12 text-brand-gold px-3 py-1 rounded-full uppercase tracking-widest tabular-nums">
              {orders.length}
            </span>
          </h2>
          <p className="text-text-primary/45 text-[11px] sm:text-xs uppercase tracking-[0.2em] leading-relaxed max-w-2xl">
            Suivi des ventes et logistique — recherche par client, e-mail ou identifiant.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch lg:justify-end w-full lg:w-auto">
          <div className="relative group min-w-0 flex-1 sm:min-w-[240px] sm:max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/35 pointer-events-none group-focus-within:text-brand-gold transition-colors"
              size={18}
              aria-hidden
            />
            <input
              type="search"
              placeholder="Nom, e-mail ou n° de commande…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              className={`admin-input w-full pl-11 pr-4 py-3.5 text-[11px] tracking-wide normal-case font-medium placeholder:text-text-primary/35 placeholder:normal-case transition-opacity ${
                searchPending ? "opacity-70" : ""
              }`}
              aria-label="Rechercher une commande"
              aria-busy={searchPending}
            />
          </div>

          <div
            className="flex flex-wrap gap-1 p-1 rounded-xl bg-text-primary/[0.04] border border-border-primary/80 shrink-0"
            role="group"
            aria-label="Filtrer par statut"
          >
            {STATUS_FILTERS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-lg text-[9px] sm:text-[10px] uppercase tracking-widest font-black transition-all ${
                  filter === id
                    ? "bg-brand-gold text-brand-black shadow-sm"
                    : "text-text-primary/45 hover:bg-text-primary/[0.06] hover:text-text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <div className="admin-table-scroll rounded-xl">
          <table className="admin-table w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="w-[15%]">Commande</th>
                <th className="min-w-[160px]">Client</th>
                <th className="w-[10%] whitespace-nowrap">Date</th>
                <th className="w-[11%] whitespace-nowrap">Total</th>
                <th className="w-[15%]">Statut</th>
                <th className="w-[13%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 md:p-24 text-center align-middle">
                    <div className="flex flex-col items-center gap-4 text-text-primary/30">
                      <Package size={48} strokeWidth={0.5} className="opacity-50" aria-hidden />
                      <p className="text-base font-serif">Aucune commande ne correspond</p>
                      <p className="text-xs uppercase tracking-widest max-w-sm">
                        Modifiez la recherche ou le filtre de statut.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const { badge, full } = orderDisplayRef(String(order.id));
                  return (
                    <tr key={order.id} className="group">
                      <td className="p-3 md:p-4 align-top">
                        <div className="flex flex-col gap-1 min-w-0 max-w-[9.5rem] sm:max-w-[11rem]">
                          <span className="font-serif text-base tracking-tight truncate" title={full}>
                            {badge}
                          </span>
                          <div className="flex items-center gap-1 min-w-0">
                            <span
                              className="text-[10px] font-mono text-text-primary/35 truncate flex-1 min-w-0"
                              title={full}
                            >
                              {full}
                            </span>
                            <button
                              type="button"
                              onClick={() => void copyOrderId(full)}
                              className="shrink-0 p-1 rounded-md text-text-primary/30 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                              title="Copier l’identifiant"
                              aria-label={`Copier l'identifiant ${badge}`}
                            >
                              <Copy size={14} aria-hidden />
                            </button>
                          </div>
                          {copiedId === full ? (
                            <span className="text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                              Copié
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-3 md:p-4 align-top min-w-0">
                        <div className="flex flex-col gap-1 min-w-0 max-w-[220px] sm:max-w-[280px]">
                          <span className="font-medium tracking-wide truncate" title={order.customer_name ?? ""}>
                            {order.customer_name ?? "—"}
                          </span>
                          <span
                            className="text-xs text-text-primary/40 truncate"
                            title={order.customer_email ?? ""}
                          >
                            {order.customer_email ?? "—"}
                          </span>
                          {order.user_phone ? (
                            <span className="text-xs text-text-primary/40 truncate" title={`${order.phone_code || ''} ${order.user_phone}`}>
                              {order.phone_code} {order.user_phone}
                            </span>
                          ) : null}
                          {order.country ? (
                            <span className="text-xs text-text-primary/40 truncate">
                              {order.country}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-3 md:p-4 text-text-primary/50 text-sm whitespace-nowrap align-top">
                        {formatOrderDate(order.created_at)}
                      </td>
                      <td className="p-3 md:p-4 align-top whitespace-nowrap">
                        <span className="text-base md:text-lg font-light text-brand-gold tabular-nums">
                          {formatMoneyMAD(Number(order.total))}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 align-top">
                        <AdminStatusPill
                          tone={adminOrderStatusTone(order.status)}
                          className="!text-[8px] !py-1.5 !px-2.5"
                          icon={statusIcon(order.status)}
                        >
                          {statusLabelFr[order.status] ?? order.status}
                        </AdminStatusPill>
                      </td>
                      <td className="p-3 md:p-4 text-right align-top">
                        <div className="inline-flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-2.5 rounded-lg hover:bg-brand-gold/10 text-text-primary/50 hover:text-brand-gold transition-colors"
                            title="Détails"
                          >
                            <Eye size={18} aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Supprimer cette commande ?")) void deleteOrder(order.id);
                            }}
                            className="p-2.5 rounded-lg hover:bg-red-500/10 text-text-primary/50 hover:text-red-500 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={18} aria-hidden />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-default"
              aria-label="Fermer"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-4xl max-h-[min(90vh,880px)] bg-bg-primary border border-border-primary rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 sm:p-10 border-b border-border-primary/50 flex justify-between items-start gap-4 shrink-0">
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.4em] font-black text-brand-gold uppercase mb-2 italic">
                    Détail de la vente
                  </p>
                  <h2 id="order-modal-title" className="text-2xl sm:text-4xl font-serif truncate">
                    Commande {orderDisplayRef(selectedOrder.id).badge}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="text-text-primary/40 font-mono text-xs break-all flex-1 min-w-0">
                      {selectedOrder.id}
                    </p>
                    <button
                      type="button"
                      onClick={() => void copyOrderId(selectedOrder.id)}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-primary text-[10px] uppercase tracking-widest font-bold text-text-primary/50 hover:text-brand-gold hover:border-brand-gold/40 transition-colors"
                    >
                      <Copy size={14} aria-hidden />
                      Copier
                    </button>
                  </div>
                  <p className="text-text-primary/35 text-sm mt-1">
                    {formatOrderDate(selectedOrder.created_at)} ·{" "}
                    {new Date(selectedOrder.created_at).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-3 rounded-xl bg-text-primary/[0.06] hover:bg-brand-gold/15 text-text-primary/50 hover:text-brand-gold transition-all shrink-0"
                  aria-label="Fermer la fenêtre"
                >
                  <XCircle size={26} strokeWidth={1} />
                </button>
              </div>

              <div className="p-6 sm:p-10 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                <div className="space-y-8 min-w-0">
                  <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-text-primary/35 flex items-center gap-3">
                    <Package size={14} aria-hidden /> Articles
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item: { id?: string; image?: string; title?: string; category?: string; price?: number }, idx: number) => (
                        <div
                          key={String(item.id ?? `${selectedOrder.id}-line-${idx}`)}
                          className="flex gap-4 items-center p-4 rounded-xl bg-text-primary/[0.03] border border-border-primary/50"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-text-primary/10 border border-border-primary/40">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : null}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-serif text-lg truncate">{item.title ?? "Article"}</p>
                            {item.category ? (
                              <p className="text-[9px] uppercase tracking-widest text-text-primary/40 mt-0.5 truncate">
                                {item.category}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-right shrink-0 tabular-nums">
                            <p className="font-light text-brand-gold">
                              {Number(item.price ?? 0).toLocaleString("fr-FR")} MAD
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-text-primary/40 italic">Aucun détail d&apos;article.</p>
                    )}
                  </div>

                  <div className="pt-8 border-t border-border-primary/50 flex justify-between items-end gap-4 flex-wrap">
                    <p className="text-[10px] tracking-widest font-black text-text-primary/30 uppercase">Total</p>
                    <p className="text-3xl sm:text-5xl font-serif text-brand-gold tabular-nums">
                      {formatMoneyMAD(Number(selectedOrder.total))}
                    </p>
                  </div>
                </div>

                <div className="space-y-10 min-w-0">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-text-primary/35 flex items-center gap-3">
                      <User size={14} aria-hidden /> Client
                    </h3>
                    <div className="space-y-5 bg-text-primary/[0.03] p-6 rounded-xl border border-border-primary/50">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20 shrink-0">
                          <User size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] tracking-widest font-black text-text-primary/35 uppercase">Nom</p>
                          <p className="text-lg font-serif break-words">{selectedOrder.customer_name ?? "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20 shrink-0">
                          <Mail size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] tracking-widest font-black text-text-primary/35 uppercase">E-mail</p>
                          <p className="text-base italic font-light break-all">{selectedOrder.customer_email ?? "—"}</p>
                        </div>
                      </div>
                      {selectedOrder.user_phone && (
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-11 h-11 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20 shrink-0">
                            <Phone size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] tracking-widest font-black text-text-primary/35 uppercase">Téléphone</p>
                            <p className="text-base font-light break-all">{selectedOrder.phone_code} {selectedOrder.user_phone}</p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.country && (
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-11 h-11 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20 shrink-0">
                            <Globe size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] tracking-widest font-black text-text-primary/35 uppercase">Pays</p>
                            <p className="text-base font-light break-all">{selectedOrder.country}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-text-primary/35 flex items-center gap-3">
                      Statut
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {(
                        [
                          ["pending", "En attente"],
                          ["completed", "Terminée"],
                          ["cancelled", "Annulée"],
                        ] as const
                      ).map(([status, label]) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => void updateOrderStatus(selectedOrder.id, status)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                            selectedOrder.status === status
                              ? "bg-brand-gold/12 border-brand-gold text-brand-gold"
                              : "bg-transparent border-border-primary/50 text-text-primary/40 hover:border-text-primary/25 hover:text-text-primary/70"
                          }`}
                        >
                          <span className="text-[10px] tracking-[0.2em] font-black uppercase">{label}</span>
                          {selectedOrder.status === status ? <CheckCircle2 size={16} aria-hidden /> : null}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
