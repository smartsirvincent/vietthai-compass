"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="zh-Hant-TW"><body>
    <main style={{ maxWidth: 640, margin: "80px auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>目前暫時無法載入內容</h1>
      <p>請稍後重新整理再試。</p>
      <button type="button" onClick={reset}>重新載入</button>
    </main>
  </body></html>;
}
