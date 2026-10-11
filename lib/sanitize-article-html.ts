import sanitizeHtml from "sanitize-html";

const articleHtmlOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "p", "div", "span", "br", "hr",
    "strong", "b", "em", "i", "u", "s", "sub", "sup",
    "ul", "ol", "li", "blockquote", "a", "figure", "figcaption", "img",
    "table", "thead", "tbody", "tr", "th", "td", "pre", "code"
  ],
  allowedAttributes: {
    a: ["href"],
    img: ["src", "alt", "title", "width", "height"],
    span: ["style"],
    div: ["style"],
    p: ["style"]
  },
  allowedStyles: {
    span: { "font-size": [/^(15|18|22|28)px$/] },
    div: { "font-size": [/^(15|18|22|28)px$/] },
    p: { "font-size": [/^(15|18|22|28)px$/] }
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false
};

export function sanitizeArticleHtml(value: string) {
  return sanitizeHtml(value, articleHtmlOptions);
}
