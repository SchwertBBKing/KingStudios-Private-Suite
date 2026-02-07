export function isSameMonth(date, reference) {
  return (
    date.getMonth() === reference.getMonth() &&
    date.getFullYear() === reference.getFullYear()
  );
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("de-DE");
}
