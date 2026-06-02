import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-[var(--color-fg)]"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-brand-500)] text-white text-sm font-bold">
            C
          </span>
          <span>컨빌 자동화 허브</span>
        </Link>
      </div>
    </header>
  );
}
