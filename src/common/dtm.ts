const pad = (n: number) => n.toString().padStart(2, '0');
export function formatDate(date: string | number, withTime = true): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  if (withTime) {
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    const s = pad(d.getSeconds());
    return `${y}-${m}-${day} ${h}:${min}:${s}`;
  }
  return `${y}-${m}-${day}`;
}
