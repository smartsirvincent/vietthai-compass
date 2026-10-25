import type { Article } from "./types";

function latestFirst(a: Article, b: Article) {
  const dateOrder = (b.publishedAt || b.updatedAt).localeCompare(a.publishedAt || a.updatedAt);
  return dateOrder || a.slug.localeCompare(b.slug);
}

export function homeEditorPicks(articles: Article[]) {
  const selected = articles.filter(article => article.editorPick === true);
  return (selected.length ? selected : articles).toSorted(latestFirst).slice(0, 3);
}

export function homePopularGuides(articles: Article[], counts: ReadonlyMap<string, number>) {
  return articles.toSorted((a, b) => (counts.get(b.slug) || 0) - (counts.get(a.slug) || 0) || latestFirst(a, b))
    .slice(0, 3);
}
