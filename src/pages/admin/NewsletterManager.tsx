import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Mail, Trash2, Calendar, Download, Send, Copy, Loader2, RefreshCw, X } from "lucide-react";
import { AdminPageHeader, AdminTableCard } from "../../components/admin/adminShared";

function formatSubscribedAt(iso: string): string {
  if (!iso?.trim()) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function escapeCsvCell(cell: string): string {
  if (/[",\n\r]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
  return cell;
}

export function NewsletterManager() {
  const { subscribers, unsubscribeNewsletter, refreshNewsletterSubscribers } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [showCampagne, setShowCampagne] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setListError(null);
    void refreshNewsletterSubscribers()
      .catch((e) => {
        if (!cancelled)
          setListError(
            (e as Error).message ||
              "Impossible de charger les abonnés. Vérifiez Supabase et les politiques RLS sur newsletter_subscribers."
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshNewsletterSubscribers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setListError(null);
    try {
      await refreshNewsletterSubscribers();
    } catch (e) {
      setListError((e as Error).message || "Échec du rafraîchissement.");
    } finally {
      setRefreshing(false);
    }
  };

  const exportSubscribers = () => {
    const BOM = "\uFEFF";
    const header = "Email,Date d'inscription";
    const body = subscribers
      .map((s) => `${escapeCsvCell(s.email)},${escapeCsvCell(s.subscribedAt)}`)
      .join("\r\n");
    const csv = BOM + header + "\r\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `abonnes-newsletter-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyAllEmails = async () => {
    if (subscribers.length === 0) return;
    const text = subscribers.map((s) => s.email.trim()).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Impossible d’accéder au presse-papiers. Utilisez l’export CSV.");
    }
  };

  const handleUnsubscribe = (id: string, email: string) => {
    if (!confirm(`Retirer ${email} de la liste ?`)) return;
    void unsubscribeNewsletter(id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">
      <AdminPageHeader
        kicker="Marketing"
        title="Abonnés newsletter"
        subtitle="Inscriptions collectées sur le site, stockées dans Supabase (table newsletter_subscribers). Export ou copie pour vos envois."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={refreshing || loading}
              className="bg-text-primary/5 text-text-primary px-5 py-3.5 text-[10px] uppercase tracking-widest font-bold hover:bg-text-primary/10 transition-all flex items-center gap-2 rounded-lg border border-border-primary/60 disabled:opacity-50"
              title="Recharger depuis Supabase"
              aria-label="Rafraîchir la liste"
            >
              <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} aria-hidden />
              Actualiser
            </button>
            <button
              type="button"
              onClick={exportSubscribers}
              disabled={subscribers.length === 0}
              className="bg-text-primary/5 text-text-primary px-6 py-3.5 text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-black transition-all flex items-center gap-2 rounded-lg border border-border-primary/60 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Exporter la liste en CSV"
            >
              <Download size={18} aria-hidden /> Exporter CSV
            </button>
            <button
              type="button"
              onClick={() => setShowCampagne(true)}
              className="bg-brand-gold/90 text-brand-black px-6 py-3.5 text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all flex items-center gap-2 rounded-lg"
              aria-label="Outils campagne e-mail"
            >
              <Send size={18} aria-hidden /> Campagne
            </button>
          </div>
        }
      />

      {listError ? (
        <div
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200/90"
          role="alert"
        >
          {listError}
        </div>
      ) : null}

      <AdminTableCard>
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-text-primary/50">
            <Loader2 size={32} className="animate-spin text-brand-gold/80" aria-hidden />
            <p className="text-sm">Chargement des abonnés…</p>
          </div>
        ) : (
          <table className="admin-table w-full text-left border-collapse">
            <thead>
              <tr>
                <th>Email</th>
                <th>Inscription</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="group">
                  <td className="p-5 md:p-6">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                        <Mail size={18} aria-hidden />
                      </div>
                      <span className="text-sm font-medium truncate">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="p-5 md:p-6">
                    <div className="flex items-center gap-2 text-sm text-text-primary/50">
                      <Calendar size={14} aria-hidden />
                      <time dateTime={subscriber.subscribedAt || undefined}>{formatSubscribedAt(subscriber.subscribedAt)}</time>
                    </div>
                  </td>
                  <td className="p-5 md:p-6">
                    <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
                      Actif
                    </span>
                  </td>
                  <td className="p-5 md:p-6">
                    <div className="flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleUnsubscribe(subscriber.id, subscriber.email)}
                        className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        title="Retirer de la liste"
                        aria-label={`Retirer ${subscriber.email}`}
                      >
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-16 md:p-20 text-center space-y-3">
                    <p className="text-text-primary/40 text-sm">Aucun abonné pour le moment.</p>
                    <p className="text-text-primary/25 text-xs max-w-md mx-auto leading-relaxed">
                      Lorsqu’un visiteur s’inscrit via le bloc newsletter du site, l’adresse est enregistrée ici. Vérifiez que la table{" "}
                      <code className="text-brand-gold/70">newsletter_subscribers</code> existe et que les politiques RLS autorisent la
                      lecture pour les admins.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </AdminTableCard>

      {showCampagne ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            aria-label="Fermer"
            onClick={() => setShowCampagne(false)}
          />
          <div
            className="relative admin-card max-w-lg w-full p-8 shadow-2xl border border-border-primary"
            role="dialog"
            aria-modal="true"
            aria-labelledby="campagne-title"
          >
            <button
              type="button"
              onClick={() => setShowCampagne(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-text-primary/40 hover:text-text-primary"
              aria-label="Fermer"
            >
              <X size={20} aria-hidden />
            </button>
            <h3 id="campagne-title" className="text-xl font-serif text-text-primary pr-10 mb-4">
              Campagne e-mail
            </h3>
            <p className="text-sm text-text-primary/55 leading-relaxed mb-6">
              L’application n’envoie pas les e-mails marketing elle-même. Utilisez cette liste dans un outil dédié (Brevo, Mailchimp, SendGrid,
              etc.) : importez le fichier CSV ou collez les adresses copiées ci-dessous.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => void copyAllEmails()}
                disabled={subscribers.length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg bg-brand-gold text-brand-black text-[10px] uppercase font-bold tracking-widest hover:opacity-95 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
              >
                <Copy size={16} aria-hidden />
                {copied ? "Copié !" : "Copier les e-mails"}
              </button>
              <button
                type="button"
                onClick={() => {
                  exportSubscribers();
                  setShowCampagne(false);
                }}
                disabled={subscribers.length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg border border-border-primary text-[10px] uppercase font-bold tracking-widest hover:bg-text-primary/5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <Download size={16} aria-hidden />
                Télécharger CSV
              </button>
            </div>
            <p className="mt-5 text-xs text-text-primary/35">
              {subscribers.length} adresse{subscribers.length !== 1 ? "s" : ""} dans la liste.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
