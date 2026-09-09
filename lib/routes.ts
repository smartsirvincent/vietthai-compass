export function findByRouteSlug<T extends { slug: string }>(items: T[], routeSlug: string): T | undefined {
  const exact = items.find((item) => item.slug === routeSlug);
  if (exact) return exact;
  try {
    const decoded = decodeURIComponent(routeSlug);
    return items.find((item) => item.slug === decoded);
  } catch {
    return undefined;
  }
}
