"use client";

import { useState } from "react";
import {
  CATEGORY_ORDER,
  TYPE_ORDER,
  type Category,
  type HubItem,
  type ItemType,
} from "@/lib/types";

interface Props {
  initial?: HubItem;
  onSubmit: (data: Omit<HubItem, "id">) => void;
  onCancel: () => void;
}

export function ItemForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [type, setType] = useState<ItemType>(initial?.type ?? "링크");
  const [categories, setCategories] = useState<Category[]>(
    initial?.categories ?? []
  );
  const [error, setError] = useState<string | null>(null);

  const toggleCat = (c: Category) =>
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (categories.length === 0) {
      setError("카테고리를 하나 이상 선택해 주세요.");
      return;
    }
    setError(null);
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      url: url.trim() || undefined,
      type,
      categories,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="이름" required>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 교회 홈페이지"
          className={inputCls}
        />
      </Field>
      <Field label="설명 (선택)">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="짧은 한 줄 설명"
          className={inputCls}
        />
      </Field>
      <Field label="URL (선택)">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className={inputCls}
        />
      </Field>
      <Field label="형태" required>
        <div className="flex flex-wrap gap-2">
          {TYPE_ORDER.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition " +
                (type === t
                  ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)] text-white"
                  : "border-[var(--color-border)] bg-white text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)]")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
      <Field label="카테고리 (복수 선택 가능)" required>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCat(c)}
              className={
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition " +
                (categories.includes(c)
                  ? "border-[var(--color-brand-500)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                  : "border-[var(--color-border)] bg-white text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)]")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </Field>

      {error && (
        <p className="text-sm text-rose-600">{error}</p>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)]"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[var(--color-brand-500)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-600)]"
        >
          {initial ? "변경 저장" : "추가"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "block w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-100)]";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[var(--color-fg)]">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}
