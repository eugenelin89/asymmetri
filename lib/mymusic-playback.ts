export type RepeatMode = "off" | "one" | "all";

export function playOrder(count: number, shuffle: boolean, current: number | null = null, random = Math.random): number[] {
  const order = Array.from({ length: count }, (_, index) => index);
  if (!shuffle) return order;
  const rest = order.filter((index) => index !== current);
  for (let index = rest.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [rest[index], rest[other]] = [rest[other], rest[index]];
  }
  return current === null ? rest : [current, ...rest];
}

export function adjacentTrack(order: number[], current: number | null, direction: 1 | -1, wrap: boolean, unavailable = new Set<number>()): number | null {
  if (current === null || !order.length) return null;
  const start = order.indexOf(current);
  if (start < 0) return null;
  for (let step = 1; step <= order.length; step++) {
    const position = start + step * direction;
    if (!wrap && (position < 0 || position >= order.length)) return null;
    const next = order[((position % order.length) + order.length) % order.length];
    if (!unavailable.has(next)) return next;
  }
  return null;
}
