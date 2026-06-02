"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { ItemCard } from "@/components/ItemCard";
import { useFavorites, useItems } from "@/lib/storage";
import { CATEGORY_ORDER } from "@/lib/types";
import type { Category, HubItem, ItemType } from "@/lib/types";

export default function Home() {
  const { items, hydrated: itemsHydrated } = useItems();
  const { favs, toggle: toggleFav, hydrated: favsHydrated } = useFavorites();

  const [category, setCategory] = useState<Category | "전체">("전체");
  const [type, setType] = useState<ItemType | "전체">("전체");
  const [query, setQuery] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (category !== "전체" && !it.categories.includes(category)) return false;
      if (type !== "전체" && it.type !== type) return false;
      if (favOnly && !favs.has(it.id)) return false;
      if (normalizedQuery) {
        const hay = (it.name + " " + (it.description ?? "")).toLowerCase();
        if (!hay.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [items, category, type, favOnly, favs, normalizedQuery]);

  const groupByCategory =
    category === "전체" && type === "전체" && !favOnly && !normalizedQuery;

  const hydrated = itemsHydrated && favsHydrated;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-fg)] sm:text-3xl">
            컨빌 자동화 허브
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            컨빌이 만든 자동화 시스템, 스킬, 사이트를 한 곳에서 모아 보세요.
          </p>
        </section>

        <section className="mb-8">
          <FilterBar
            activeCategory={category}
            activeType={type}
            query={query}
            onCategoryChange={setCategory}
            onTypeChange={setType}
            onQueryChange={setQuery}
            showFavoritesOnly={favOnly}
            onToggleFavoritesOnly={() => setFavOnly((v) => !v)}
            totalCount={items.length}
            visibleCount={filtered.length}
          />
        </section>

        <section>
          {!hydrated ? (
            <SkeletonGrid />
          ) : filtered.length === 0 ? (
            <EmptyState favOnly={favOnly} query={query} />
          ) : groupByCategory ? (
            <GroupedView items={filtered} favs={favs} onToggleFav={toggleFav} />
          ) : (
            <CardGrid items={filtered} favs={favs} onToggleFav={toggleFav} />
          )}
        </section>
      </main>
      <footer className="mx-auto w-full max-w-6xl px-6 pb-10 pt-4 text-xs text-[var(--color-fg-subtle)]">
        © 컨빌 자동화 허브 · 항목 관리는 우측 상단{" "}
        <span className="font-medium text-[var(--color-fg-muted)]">관리자</span>{" "}
        탭에서.
      </footer>
    </>
  );
}

function CardGrid({
  items,
  favs,
  onToggleFav,
}: {
  items: HubItem[];
  favs: Set<string>;
  onToggleFav: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <ItemCard
          key={it.id}
          item={it}
          favored={favs.has(it.id)}
          onToggleFavorite={onToggleFav}
        />
      ))}
    </div>
  );
}

function GroupedView({
  items,
  favs,
  onToggleFav,
}: {
  items: HubItem[];
  favs: Set<string>;
  onToggleFav: (id: string) => void;
}) {
  const grouped = new Map<Category, HubItem[]>();
  for (const c of CATEGORY_ORDER) grouped.set(c, []);
  for (const it of items) {
    const primary = it.categories[0];
    if (primary && grouped.has(primary)) grouped.get(primary)!.push(it);
  }
  const sections = CATEGORY_ORDER.filter((c) => grouped.get(c)!.length > 0);

  return (
    <div className="space-y-10">
      {sections.map((c) => (
        <div key={c}>
          <div className="mb-4 flex items-baseline justify-between border-b border-[var(--color-border)] pb-2">
            <h2 className="text-lg font-semibold text-[var(--color-fg)]">{c}</h2>
            <span className="text-xs text-[var(--color-fg-subtle)]">
              {grouped.get(c)!.length}개
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.get(c)!.map((it) => (
              <ItemCard
                key={it.id}
                item={it}
                favored={favs.has(it.id)}
                onToggleFavorite={onToggleFav}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-xl border border-[var(--color-border)] bg-white"
        />
      ))}
    </div>
  );
}

function EmptyState({ favOnly, query }: { favOnly: boolean; query: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-[var(--color-border)] bg-white py-16 text-center">
      <div>
        <p className="text-sm font-medium text-[var(--color-fg)]">
          {favOnly
            ? "즐겨찾기한 항목이 없어요"
            : query
            ? "검색 결과가 없어요"
            : "표시할 항목이 없어요"}
        </p>
        <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">
          필터를 바꾸거나 검색어를 다시 입력해 보세요.
        </p>
      </div>
    </div>
  );
}
