"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { ItemForm } from "@/components/ItemForm";
import { useItems } from "@/lib/storage";
import { SEED_ITEMS } from "@/lib/seed";
import {
  CATEGORY_STYLE,
  TYPE_STYLE,
  type HubItem,
} from "@/lib/types";

type EditState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; item: HubItem };

export default function AdminPage() {
  const {
    items,
    hydrated,
    addItem,
    updateItem,
    removeItem,
    restoreSeed,
    removedSeeds,
    overrides,
  } = useItems();

  const [edit, setEdit] = useState<EditState>({ mode: "closed" });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const removedSeedItems = useMemo(
    () => SEED_ITEMS.filter((s) => removedSeeds.has(s.id)),
    [removedSeeds]
  );

  return (
    <>
      <Header activeAdmin />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-fg)]">
              관리자
            </h1>
            <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
              항목을 추가/수정/삭제할 수 있습니다. 모든 변경사항은 이 브라우저에만 저장돼요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEdit({ mode: "add" })}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--color-brand-500)] px-4 text-sm font-medium text-white transition hover:bg-[var(--color-brand-600)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M12 5v14M5 12h14" />
            </svg>
            새 항목 추가
          </button>
        </section>

        {edit.mode !== "closed" && (
          <section className="mb-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-4 text-base font-semibold">
              {edit.mode === "add" ? "새 항목 추가" : "항목 수정"}
            </h2>
            <ItemForm
              initial={edit.mode === "edit" ? edit.item : undefined}
              onCancel={() => setEdit({ mode: "closed" })}
              onSubmit={(data) => {
                if (edit.mode === "add") {
                  addItem({ ...data, id: `custom-${Date.now()}` });
                } else {
                  updateItem(edit.item.id, data);
                }
                setEdit({ mode: "closed" });
              }}
            />
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-muted)] text-left text-xs font-semibold text-[var(--color-fg-subtle)]">
              <tr>
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">형태</th>
                <th className="px-4 py-3">카테고리</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3 text-right">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {!hydrated ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-fg-subtle)]">
                    로딩 중…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-fg-subtle)]">
                    항목이 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((it) => {
                  const isSeed = SEED_ITEMS.some((s) => s.id === it.id);
                  const isOverridden = isSeed && !!overrides[it.id];
                  return (
                    <tr key={it.id} className="align-top">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--color-fg)]">{it.name}</span>
                          {isOverridden && (
                            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                              수정됨
                            </span>
                          )}
                          {!isSeed && (
                            <span className="rounded bg-[var(--color-brand-50)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-brand-700)]">
                              사용자 추가
                            </span>
                          )}
                        </div>
                        {it.description && (
                          <div className="mt-0.5 line-clamp-1 text-xs text-[var(--color-fg-subtle)]">
                            {it.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${TYPE_STYLE[it.type].bg} ${TYPE_STYLE[it.type].text}`}
                        >
                          {it.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {it.categories.map((c) => (
                            <span
                              key={c}
                              className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ${CATEGORY_STYLE[c]}`}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="max-w-[220px] px-4 py-3">
                        {it.url ? (
                          <a
                            href={it.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-xs text-[var(--color-brand-600)] hover:underline"
                            title={it.url}
                          >
                            {it.url}
                          </a>
                        ) : (
                          <span className="text-xs text-[var(--color-fg-subtle)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {confirmId === it.id ? (
                          <div className="inline-flex items-center gap-2">
                            <span className="text-xs text-[var(--color-fg-muted)]">삭제?</span>
                            <button
                              onClick={() => {
                                removeItem(it.id);
                                setConfirmId(null);
                              }}
                              className="rounded-md bg-rose-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-600"
                            >
                              확인
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="rounded-md border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)]"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setEdit({ mode: "edit", item: it })}
                              className="rounded-md border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => setConfirmId(it.id)}
                              className="rounded-md border border-transparent px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>

        {removedSeedItems.length > 0 && (
          <section className="mt-8 rounded-xl border border-dashed border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">
              삭제된 기본 항목 ({removedSeedItems.length})
            </h2>
            <ul className="space-y-2">
              {removedSeedItems.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-[var(--color-fg-muted)]">{it.name}</span>
                  <button
                    onClick={() => restoreSeed(it.id)}
                    className="rounded-md border border-[var(--color-border)] px-2.5 py-1 text-xs hover:border-[var(--color-border-strong)]"
                  >
                    복구
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
