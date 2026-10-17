export function taipeiToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(now);
}

export function articleDates(selected: string, now = new Date()) {
  const today = taipeiToday(now);
  const publishedAt = selected || today;
  const parsed = new Date(`${publishedAt}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== publishedAt) {
    throw new Error("請填寫有效的發布日期。");
  }
  if (publishedAt > today) throw new Error("發布日期不可晚於今天；目前不支援預約發布。");
  return { publishedAt, updatedAt: today };
}
