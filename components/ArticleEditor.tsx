"use client";

import { useEffect, useRef, useState } from "react";

function markdownToHtml(value: string) {
  if (/<(h1|h2|h3|p|img|strong|em|span|div|ul|ol|li|br)\b/i.test(value)) return value;

  return value
    .split(/\n+/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      const image = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (image) return `<img src="${image[2]}" alt="${image[1]}" />`;
      if (trimmed.startsWith("### ")) return `<h3>${trimmed.slice(4)}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2>${trimmed.slice(3)}</h2>`;
      if (trimmed.startsWith("# ")) return `<h1>${trimmed.slice(2)}</h1>`;
      return `<p>${trimmed}</p>`;
    })
    .join("");
}

function runCommand(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export function ArticleEditor({ defaultValue = "" }: { defaultValue?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const altRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const syncContent = () => {
    if (hiddenRef.current && editorRef.current) hiddenRef.current.value = editorRef.current.innerHTML;
  };

  useEffect(() => {
    if (editorRef.current && hiddenRef.current) {
      editorRef.current.innerHTML = markdownToHtml(defaultValue);
      syncContent();
    }
  }, [defaultValue]);

  const applyBlock = (tag: "p" | "h1" | "h2" | "h3") => {
    editorRef.current?.focus();
    runCommand("formatBlock", tag);
    syncContent();
  };

  const applyInline = (command: "bold" | "italic") => {
    editorRef.current?.focus();
    runCommand(command);
    syncContent();
  };

  const applyFontSize = (size: string) => {
    editorRef.current?.focus();
    runCommand("fontSize", "3");
    const fontElements = editorRef.current?.querySelectorAll("font[size='3']");
    fontElements?.forEach((element) => {
      const span = document.createElement("span");
      span.style.fontSize = size;
      span.innerHTML = element.innerHTML;
      element.replaceWith(span);
    });
    syncContent();
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
      editorRef.current?.focus();
      runCommand("insertHTML", `<figure><img src="${result.url}" alt="${altRef.current?.value || "文章圖片"}" /><figcaption>${altRef.current?.value || ""}</figcaption></figure>`);
      syncContent();
      setUploadStatus("圖片已插入文章，並可直接在編輯區預覽。");
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : "圖片上傳失敗。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="article-editor">
      <textarea ref={hiddenRef} name="content" defaultValue={defaultValue} hidden />
      <div className="editor-toolbar" aria-label="文章編輯工具">
        <button type="button" onClick={() => applyBlock("p")}>段落</button>
        <button type="button" onClick={() => applyBlock("h1")}>H1</button>
        <button type="button" onClick={() => applyBlock("h2")}>H2</button>
        <button type="button" onClick={() => applyBlock("h3")}>H3</button>
        <button type="button" onClick={() => applyInline("bold")}>粗體</button>
        <button type="button" onClick={() => applyInline("italic")}>斜體</button>
        <select defaultValue="" onChange={(event) => event.target.value && applyFontSize(event.target.value)} aria-label="文字大小">
          <option value="" disabled>文字大小</option>
          <option value="15px">小</option>
          <option value="18px">一般</option>
          <option value="22px">大</option>
          <option value="28px">特大</option>
        </select>
      </div>
      <div className="editor-upload-bar">
        <input ref={fileRef} type="file" accept="image/*" />
        <input ref={altRef} type="text" placeholder="圖片替代文字 alt" />
        <button type="button" onClick={uploadAndInsert} disabled={isUploading}>
          {isUploading ? "上傳中" : "上傳並插入圖片"}
        </button>
      </div>
      {uploadStatus ? <p className="form-note">{uploadStatus}</p> : null}
      <div
        ref={editorRef}
        className="rich-editor-surface"
        contentEditable
        suppressContentEditableWarning
        onInput={syncContent}
        onBlur={syncContent}
        aria-label="文章內容編輯器"
      />
      <p className="form-note">可直接選取文字後套用 H1/H2/H3、粗體、斜體與文字大小。圖片上傳後會直接插入並顯示預覽。</p>
    </div>
  );
}
