"use client";

import { useEffect, useState, useCallback } from "react";
import type { HubItem } from "./types";
import { SEED_ITEMS } from "./seed";

const FAV_KEY = "convil-hub:favorites";
const CUSTOM_KEY = "convil-hub:custom-items";
const OVERRIDES_KEY = "convil-hub:overrides";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const arr = safeParse<string[]>(localStorage.getItem(FAV_KEY), []);
    setFavs(new Set(arr));
    setHydrated(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { favs, toggle, hydrated };
}

export type ItemOverride = Partial<Omit<HubItem, "id">>;

export function useItems() {
  const [custom, setCustom] = useState<HubItem[]>([]);
  const [overrides, setOverrides] = useState<Record<string, ItemOverride>>({});
  const [removedSeeds, setRemovedSeeds] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const c = safeParse<HubItem[]>(localStorage.getItem(CUSTOM_KEY), []);
    const raw = safeParse<{
      overrides?: Record<string, ItemOverride>;
      removedSeeds?: string[];
    }>(localStorage.getItem(OVERRIDES_KEY), {});
    setCustom(c);
    setOverrides(raw.overrides ?? {});
    setRemovedSeeds(new Set(raw.removedSeeds ?? []));
    setHydrated(true);
  }, []);

  const persistOverrides = (
    nextOverrides: Record<string, ItemOverride>,
    nextRemoved: Set<string>
  ) => {
    localStorage.setItem(
      OVERRIDES_KEY,
      JSON.stringify({
        overrides: nextOverrides,
        removedSeeds: [...nextRemoved],
      })
    );
  };

  const persistCustom = (next: HubItem[]) => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
  };

  const items: HubItem[] = (() => {
    const seedsActive = SEED_ITEMS.filter((s) => !removedSeeds.has(s.id)).map(
      (s) => ({ ...s, ...overrides[s.id] })
    );
    return [...seedsActive, ...custom];
  })();

  const addItem = useCallback(
    (item: HubItem) => {
      setCustom((prev) => {
        const next = [...prev, item];
        persistCustom(next);
        return next;
      });
    },
    []
  );

  const updateItem = useCallback(
    (id: string, patch: ItemOverride) => {
      const isSeed = SEED_ITEMS.some((s) => s.id === id);
      if (isSeed) {
        setOverrides((prev) => {
          const next = { ...prev, [id]: { ...prev[id], ...patch } };
          persistOverrides(next, removedSeeds);
          return next;
        });
      } else {
        setCustom((prev) => {
          const next = prev.map((it) =>
            it.id === id ? ({ ...it, ...patch } as HubItem) : it
          );
          persistCustom(next);
          return next;
        });
      }
    },
    [removedSeeds]
  );

  const removeItem = useCallback(
    (id: string) => {
      const isSeed = SEED_ITEMS.some((s) => s.id === id);
      if (isSeed) {
        setRemovedSeeds((prev) => {
          const next = new Set(prev);
          next.add(id);
          persistOverrides(overrides, next);
          return next;
        });
      } else {
        setCustom((prev) => {
          const next = prev.filter((it) => it.id !== id);
          persistCustom(next);
          return next;
        });
      }
    },
    [overrides]
  );

  const restoreSeed = useCallback(
    (id: string) => {
      setRemovedSeeds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        persistOverrides(overrides, next);
        return next;
      });
      setOverrides((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        persistOverrides(next, removedSeeds);
        return next;
      });
    },
    [overrides, removedSeeds]
  );

  return {
    items,
    hydrated,
    addItem,
    updateItem,
    removeItem,
    restoreSeed,
    removedSeeds,
    overrides,
  };
}
