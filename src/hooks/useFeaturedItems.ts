import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

export function useFeaturedItems(pageSize: number = 12) {
  const { activities, articles } = useAppContext();

  const allFeaturedItems = useMemo(() => {
    const featuredActivities = activities
      .filter(a => a.isFeatured)
      .map(a => ({
        type: 'activity' as const,
        id: a.id,
        title: a.title,
        description: a.description,
        image: a.image, // Use activity's own image
        price: a.price,
        displayType: a.featuredDisplayType || 'card' as const,
        data: a,
      }));

    const featuredArticles = articles
      .filter(ar => ar.isFeatured)
      .map(ar => ({
        type: 'article' as const,
        id: ar.id,
        title: ar.title,
        description: ar.description,
        image: ar.image, // Use article's own image
        price: ar.price?.toString() || ar.pricePerUnit?.toString() || '',
        displayType: ar.featuredDisplayType || 'card' as const,
        data: ar,
      }));

    // Merge and sort by creation date (newest first)
    return [...featuredActivities, ...featuredArticles].sort((a, b) => {
      const ts = (x: { created_at?: string }) =>
        x.created_at ? new Date(x.created_at).getTime() : 0;
      return ts(b.data) - ts(a.data);
    });
  }, [activities, articles]);

  const paginatedItems = useMemo(() => {
    return allFeaturedItems.slice(0, pageSize);
  }, [allFeaturedItems, pageSize]);

  return {
    items: paginatedItems,
    allItems: allFeaturedItems,
    total: allFeaturedItems.length,
    hasMore: paginatedItems.length < allFeaturedItems.length,
    loadMore: () => {}, // Pagination handled by parent component
  };
}
