import { Item, itemKey } from '../data/khmer';

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/** Draw `n` distractors from a pool, excluding the target item. */
export function sampleOthers(pool: Item[], exclude: Item, n: number): Item[] {
  const exKey = itemKey(exclude);
  return shuffle(pool.filter((x) => itemKey(x) !== exKey)).slice(0, n);
}
