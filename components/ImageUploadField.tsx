"use client";

import { useEffect, useRef, useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  folder?: string;
  placeholder?: string;
  note?: string;
};

export function ImageUploadField({
  label,
  name,
  defaultValue = "",
  folder = "vietthai-compass",
  placeholder = "圖片網址，或直接上傳照片",
  note
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setUrl(defaultValue);
    setStatus("");
  }, [defaultValue]);

  const upload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setStatus("請先選擇圖片。");
      return;
    }

    setIsUploading(true);
    setStatus("上傳中...");
    const body = new FormData();
    body.set("file", file);
    body.set("folder", folder);

    try {
      const response = await fetch("/admin/api/upload", { method: "POST", body });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "圖片上傳失敗。");
      setUrl(result.url);
      setStatus("圖片已上傳。");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "圖片上傳失敗。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className="image-upload-field">
      {label}
      <input name={name} value={url} onChange={(event) => setUrl(event.target.value)} placeholder={placeholder} />
      {url ? <img src={url} alt={`${label}預覽`} /> : null}
      <span className="image-upload-controls">
        <input ref={inputRef} type="file" accept="image/*" />
        <button type="button" onClick={upload} disabled={isUploading}>
          {isUploading ? "上傳中" : "上傳照片"}
        </button>
      </span>
      {status ? <small>{status}</small> : note ? <small>{note}</small> : null}
    </label>
  );
}
