export function timeToTodayISO(hh: number, mm: number): string {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hh, mm).toISOString();
}
