import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAppContext, type Activity, type Article } from "../context/AppContext";

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function RandomActivityConcept() {
  const { activities, articles, universes } = useAppContext();

  const candidates = useMemo(
    () => activities.filter((activity) => articles.some((article) => article.activityId === activity.id)),
    [activities, articles]
  );
  const [selection, setSelection] = useState<{ activity: Activity; items: Article[] } | null>(null);

  useEffect(() => {
    if (candidates.length === 0) {
      setSelection(null);
      return;
    }

    const pickSelection = () => {
      const selectedActivity = candidates[Math.floor(Math.random() * candidates.length)];
      const pool = shuffle(articles.filter((article) => article.activityId === selectedActivity.id));
      setSelection({
        activity: selectedActivity,
        items: pool.slice(0, 4),
      });
    };

    pickSelection();
    const intervalId = window.setInterval(pickSelection, 10000);
    return () => window.clearInterval(intervalId);
  }, [candidates, articles]);

  if (!selection || selection.items.length === 0) return null;

  const { activity, items } = selection;
  const universe = universes.find((u) => u.id === activity.universeId);
  const universeId = universe?.id ?? "";

  const itemHref = (article: Article) => {
    if (!universeId) return "/services";
    const hasChildren = articles.some((a) => a.parentArticleId === article.id && a.articleType === "child");
    if (hasChildren) return `/article/${universeId}/${activity.id}/${article.id}/sub-articles`;
    return `/article/${universeId}/${activity.id}/${article.id}/detail`;
  };

  return (
    <section className="bg-brand-black py-16 sm:py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          <div className="overflow-hidden border border-white/10 bg-white/5">
            <img
              src={activity.image}
              alt={activity.title}
              loading="lazy"
              decoding="async"
              className="h-full min-h-[420px] w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <h3 className="font-serif text-3xl text-white sm:text-4xl">{activity.title}</h3>
              {universeId ? (
                <Link
                  to={`/activity/${universeId}/${activity.id}/articles`}
                  className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold hover:text-white"
                >
                  Voir plus
                </Link>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {items.map((article) => (
                <Link
                  key={article.id}
                  to={itemHref(article)}
                  className="group overflow-hidden border border-white/10 bg-white/5 transition-colors hover:border-brand-gold/50"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-white/10">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-[11px] font-bold uppercase tracking-wide text-white">
                      {article.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {universeId ? (
              <Link
                to={`/activity/${universeId}/${activity.id}/articles`}
                className="inline-flex min-h-11 items-center justify-center bg-brand-gold px-8 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-black hover:bg-brand-gold/90"
              >
                Voir plus
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

