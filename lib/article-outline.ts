import { htmlToDOM, type DOMNode } from "html-react-parser";
export function isArticleHtml(content: string) { return /<(h1|h2|h3|p|div|img|strong|em|span|figure|figcaption|ul|ol|li|br)\b/i.test(content); }
export function nodeText(node: DOMNode): string { return node.type === "text" ? node.data : "children" in node ? (node.children as DOMNode[]).map(nodeText).join("") : ""; }
export function isOutlineHeading(text: string) { const label = text.trim(); return label.length > 0 && label.length <= 80; }
export function articleOutline(content: string) {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let section = 0;
  function add(text: string, level: number) {
    const id = `article-section-${++section}`;
    if (isOutlineHeading(text)) headings.push({ id, text: text.trim(), level: Math.max(2, level) });
  }
  function walk(nodes: DOMNode[]) {
    for (const node of nodes) {
      if (node.type === "tag" && /^h[123]$/.test(node.name)) add(nodeText(node), Number(node.name[1]));
      if ("children" in node) walk(node.children as DOMNode[]);
    }
  }
  if (isArticleHtml(content)) walk(htmlToDOM(content));
  else for (const line of content.split(/\n+/)) { const match = line.match(/^(#{1,3})\s+(.+)$/); if (match) add(match[2], match[1].length); }
  return headings;
}
