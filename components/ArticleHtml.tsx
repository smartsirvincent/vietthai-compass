import parse, { domToReact, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import { ContentImage } from "@/components/ContentImage";
import { isOutlineHeading, nodeText } from "@/lib/article-outline";
import { sanitizeArticleHtml } from "@/lib/sanitize-article-html";

function renderOptions(): HTMLReactParserOptions {
  let section = 0;
  const options: HTMLReactParserOptions = {
  replace(node) {
    if (node.type !== "tag") return;
    if (/^h[123]$/.test(node.name)) {
      const id = `article-section-${++section}`;
      const children = domToReact(node.children as DOMNode[], options);
      if (!isOutlineHeading(nodeText(node))) return <div id={id} className="article-prose-block">{children}</div>;
      return node.name === "h3" ? <h3 id={id}>{children}</h3> : <h2 id={id}>{children}</h2>;
    }
    if (node.name === "img" && node.attribs.src) {
      return <ContentImage src={node.attribs.src} alt={node.attribs.alt || ""}
        className="article-inline-image" sizes="(max-width: 900px) 100vw, 800px" />;
    }
  }
};
  return options;
}

// Transform only the public presentation; the editor's stored HTML stays unchanged.
export function ArticleHtml({ content }: { content: string }) {
  return <div>{parse(sanitizeArticleHtml(content), renderOptions())}</div>;
}
