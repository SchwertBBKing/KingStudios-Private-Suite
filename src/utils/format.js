export function formatCurrency(value, currency = "EUR") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}
