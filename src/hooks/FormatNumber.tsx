export function formatNumber(num?: number): string {
  if (typeof num !== "number" || isNaN(num)) return "0";
  return num.toLocaleString("ru-RU");
}
