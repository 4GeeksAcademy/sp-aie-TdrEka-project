import Link from "next/link";

interface HeaderProps {
  showBack?: boolean;
}

export function Header({ showBack = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700 bg-[#0f172a]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-white">Track</span>
          <span className="text-xl font-semibold tracking-tight text-[#f97316]">Flow</span>
          <span className="text-sm text-slate-400">· People & Talent</span>
        </div>
        <p className="text-xs text-slate-300">Executive Assistant · Zaragoza</p>
      </div>
      {showBack ? (
        <nav className="mx-auto max-w-7xl px-4 pb-3">
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 transition hover:text-[#f97316]"
          >
            ← All candidates
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
