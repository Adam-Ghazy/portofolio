'use client';

import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Reorder rows of one admin list via PUT /api/reorder, with optimistic
 * swapping and rollback + refetch on failure.
 * `move(index, dir)` swaps rows in `items` and persists the new order.
 */
export function useReorder<T extends { id?: number }>(
  table: string,
  items: T[],
  setItems: (next: T[]) => void,
  refetch: () => void
) {
  const [saving, setSaving] = useState(false);

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setSaving(true);
    try {
      const payload = next
        .map((item, i) => ({ id: item.id, sort_order: i }))
        .filter((item): item is { id: number; sort_order: number } => typeof item.id === 'number');
      const res = await fetch('/api/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, items: payload }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('Failed to save order');
      refetch();
    } finally {
      setSaving(false);
    }
  }

  return { move, saving };
}
