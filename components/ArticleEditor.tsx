"use client";

import { useRef, useState } from "react";

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
  const fileRef = useRef<HTMLInputElement>(null);
  const altRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const insert = (text: string) => {
    if (ref.current) insertAtCursor(ref.current, text);
  };

  const uploadAndInsert = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setUploadStatus("請先選擇圖片。");
      return;
    }

    setIsUploading(true);
    setUploadStatus("上傳中...");
    const body = new FormData();
    body.set("file", file);
    body.set("folder", "vietthai-compass/articles/inline");

    try {
      const response = await fetch("/admin/api/upload", { method: "POST", body });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "圖片上傳失敗。");
      insert(`\n![${altRef.current?.value || "文章圖片"}](${result.url})\n`);
      setUploadStatus("圖片已插入文章。");
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : "圖片上傳失敗。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="article-editor">
      <div className="editor-toolbar" aria-label="文章編輯工具">
        <button type="button" onClick={() => insert("\n# H1 標題\n")}>H1</button>
        <button type="button" onClick={() => insert("\n## H2 標題\n")}>H2</button>
        <button type="button" onClick={() => insert("\n### H3 標題\n")}>H3</button>
        <button type="button" onClick={() => insert("\n![圖片替代文字](/brand-assets/home-hero-vietthai-commerce.png)\n")}>圖片</button>
      </div>
      <div className="editor-upload-bar">
        <input ref={fileRef} type="file" accept="image/*" />
        <input ref={altRef} type="text" placeholder="圖片替代文字 alt" />
        <button type="button" onClick={uploadAndInsert} disabled={isUploading}>
          {isUploading ? "上傳中" : "上傳並插入"}
        </button>
      </div>
      {uploadStatus ? <p className="form-note">{uploadStatus}</p> : null}
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
