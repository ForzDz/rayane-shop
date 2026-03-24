function randomSixDigits(): string {
  // 000000 -> 999999, faible risque de collision pour petit volume.
  // Pour un séquentiel strict, utiliser une séquence/trigger côté Postgres.
  const n = Math.floor(Math.random() * 1_000_000);
  return String(n).padStart(6, "0");
}

export function generatePublicOrderId(date = new Date()): string {
  const year = date.getFullYear();
  return `CMD-${year}-${randomSixDigits()}`;
}

