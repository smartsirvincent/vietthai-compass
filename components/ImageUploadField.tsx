"use client";

import { useEffect, useRef, useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  folder?: string;
  placeholder?: string;
  note?: string;
  recommendedWidth?: number;
};

export function ImageUploadField({
  label,
  name,
  defaultValue = "",
  folder = "vietthai-compass",
  placeholder = "圖片網址，或直接上傳照片",
  note,
  recommendedWidth = 0
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
      const result = (await response.json()) as { url?: string; width?: number; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "圖片上傳失敗。");
      setUrl(result.url);
      if (inputRef.current) inputRef.current.value = "";
      setStatus(result.width && result.width < recommendedWidth
        ? `原圖寬度只有 ${result.width} px，建議至少 ${recommendedWidth} px；放大後可能模糊。可重新上傳較大的原圖，或儲存目前圖片。`
        : "圖片已上傳，請儲存表單以套用到前台。");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "圖片上傳失敗。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className="image-upload-field" data-upload-pending={isUploading || Boolean(inputRef.current?.files?.length)}>
      {label}
      <input name={name} value={url} onChange={(event) => setUrl(event.target.value)} placeholder={placeholder} />
      {url ? <img src={url} alt={`${label}預覽`} /> : null}
      <span className="image-upload-controls">
        <input ref={inputRef} type="file" accept="image/*" disabled={isUploading} onChange={() => setStatus(inputRef.current?.files?.length ? "照片已選取，請按上傳照片。" : "")} />
        <button type="button" onClick={upload} disabled={isUploading}>
          {isUploading ? "上傳中" : "上傳照片"}
        </button>
      </span>
      {status ? <small>{status}</small> : note ? <small>{note}</small> : null}
    </label>
  );
}
