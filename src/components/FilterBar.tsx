import { CATEGORY_ORDER, TYPE_ORDER } from "@/lib/types";
import type { Category, ItemType } from "@/lib/types";

interface Props {
  activeCategory: Category | "전체";
  activeType: ItemType | "전체";
  query: string;
  onCategoryChange: (c: Category | "전체") => void;
  onTypeChange: (t: ItemType | "전체") => void;
  onQueryChange: (q: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalCount: number;
  visibleCount: number;
}

const chipBase =
  "inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition cursor-pointer";

export function FilterBar({
  activeCategory,
  activeType,
  query,
  onCategoryChange,
  onTypeChange,
  onQueryChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  totalCount,
  visibleCount,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-fg-subtle)]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="이름이나 설명으로 검색"
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
          />
        </div>
        <button
          type="button"
          onClick={onToggleFavoritesOnly}
          className={
            chipBase +
            " " +
            (showFavoritesOnly
              ? "border-[#f5a524] bg-amber-50 text-amber-700"
              : "border-[var(--color-border)] bg-white text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)]")
          }
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={showFavoritesOnly ? "#f5a524" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className="mr-1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
          </svg>
          즐겨찾기만 보기
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-fg-subtle)]">카테고리</span>
          <ChipButton
            label="전체"
            active={activeCategory === "전체"}
            onClick={() => onCategoryChange("전체")}
          />
          {CATEGORY_ORDER.map((c) => (
            <ChipButton
              key={c}
              label={c}
              active={activeCategory === c}
              onClick={() => onCategoryChange(c)}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-fg-subtle)]">형태</span>
          <ChipButton
            label="전체"
            active={activeType === "전체"}
            onClick={() => onTypeChange("전체")}
          />
          {TYPE_ORDER.map((t) => (
            <ChipButton
              key={t}
              label={t}
              active={activeType === t}
              onClick={() => onTypeChange(t)}
            />
          ))}
        </div>
      </div>

      <div className="text-xs text-[var(--color-fg-subtle)]">
        총 {totalCount}개 중 {visibleCount}개 표시
      </div>
    </div>
  );
}

function ChipButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        chipBase +
        " " +
        (active
          ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)] text-white"
          : "border-[var(--color-border)] bg-white text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)]")
      }
    >
      {label}
    </button>
  );
}
