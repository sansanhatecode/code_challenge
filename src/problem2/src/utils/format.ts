export function formatNumber(value: number): string {
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1)
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  const digits = Math.max(4, -Math.floor(Math.log10(abs)) + 4);
  return value.toFixed(Math.min(digits, 6));
}

export function formatUsd(price: number): string {
  if (price === 0) return "$0.00";
  if (price < 0.01) return `$${formatNumber(price)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
