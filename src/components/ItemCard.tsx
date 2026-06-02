import type { HubItem } from "@/lib/types";
import { CATEGORY_STYLE, TYPE_STYLE } from "@/lib/types";

interface Props {
  item: HubItem;
  favored: boolean;
  onToggleFavorite: (id: string) => void;
}

export function ItemCard({ item, favored, onToggleFavorite }: Props) {
  const hasUrl = !!item.url;
  const typeStyle = TYPE_STYLE[item.type];

  const cardClass =
    "group relative flex h-full flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-white p-5 transition hover:border-[var(--color-brand-500)] hover:shadow-[0_2px_12px_rgba(51,102,255,0.08)]";

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${typeStyle.bg} ${typeStyle.text}`}
          >
            {typeStyle.label}
          </span>
          {item.categories.map((c) => (
            <span
              key={c}
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLE[c]}`}
            >
              {c}
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-label={favored ? "즐겨찾기 해제" : "즐겨찾기"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className="-mr-1 -mt-1 grid h-8 w-8 place-items-center rounded-md text-[var(--color-fg-subtle)] hover:bg-[var(--color-surface-muted)]"
        >
          {favored ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#f5a524">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          )}
        </button>
      </div>
      <h3 className="text-base font-semibold leading-snug text-[var(--color-fg)]">
        {item.name}
      </h3>
      {item.description && (
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          {item.description}
        </p>
      )}
      <div className="mt-auto pt-1 text-xs text-[var(--color-fg-subtle)]">
        {hasUrl ? (
          <span className="inline-flex items-center gap-1 text-[var(--color-brand-600)] group-hover:underline">
            바로가기
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
        ) : (
          <span>URL 없음 (준비 중 또는 로컬)</span>
        )}
      </div>
    </>
  );

  if (hasUrl) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        {content}
      </a>
    );
  }

  return <div className={cardClass + " cursor-default"}>{content}</div>;
}
