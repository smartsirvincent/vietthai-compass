"use client";

import { useRef } from "react";

function insertAtCursor(textarea: HTMLTextAreaElement, text: string) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  textarea.value = `${before}${text}${after}`;
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
}

export function ArticleEditor({ defaultValue = "" }: { defaultValue?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const insert = (text: string) => {
    if (ref.current) insertAtCursor(ref.current, text);
  };

  return (
    <div className="article-editor">
      <div className="editor-toolbar" aria-label="文章編輯工具">
        <button type="button" onClick={() => insert("\n# H1 標題\n")}>H1</button>
        <button type="button" onClick={() => insert("\n## H2 標題\n")}>H2</button>
        <button type="button" onClick={() => insert("\n### H3 標題\n")}>H3</button>
        <button type="button" onClick={() => insert("\n![圖片替代文字](/brand-assets/home-hero-vietthai-commerce.png)\n")}>圖片</button>
      </div>
      <textarea
        ref={ref}
        name="content"
        rows={16}
        defaultValue={defaultValue}
        placeholder={"可輸入文章內容，例如：\n# 主標題\n## 段落標題\n### 小標題\n![圖片替代文字](/brand-assets/image.png)"}
      />
      <p className="form-note">圖片格式請使用：![圖片替代文字](圖片網址)。這裡的圖片替代文字會用作圖片 alt。</p>
    </div>
  );
}
