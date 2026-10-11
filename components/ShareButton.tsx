"use client";
import { useState } from "react";
import { Share2 } from "lucide-react";
export function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState("");
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title, url: location.href });
      else { await navigator.clipboard.writeText(location.href); setStatus("連結已複製"); }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) setStatus("無法分享，請複製網址列的連結。");
    }
  }
  return <span className="share-action"><button type="button" className="secondary-button" onClick={share}><Share2 size={16} />分享</button><span role="status">{status}</span></span>;
}
