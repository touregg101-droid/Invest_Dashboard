export function formatNumber(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "미제공";
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function formatPrice(value?: number) {
  if (value === undefined) return "미제공";
  return `${formatNumber(value)}원`;
}

export function formatPercent(value?: number) {
  if (value === undefined) return "미제공";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function toneClass(value: number) {
  if (value > 0) return "text-rise";
  if (value < 0) return "text-fall";
  return "text-muted";
}

export function formatFlow(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value)}억`;
}

export function newestDateLabel(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));
}
