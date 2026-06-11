export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-gradient text-ink-900">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4 7 20 12 10 17 20 21 4" />
            </svg>
          </span>
          <span className="font-display text-lg tracking-widest2 text-silver">
            WHITAKER
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] uppercase tracking-[0.16em] text-silver-dim">
          <a href="#plataforma" className="transition-colors hover:text-gold">
            Plataforma
          </a>
          <a href="#ia" className="transition-colors hover:text-gold">
            Inteligência
          </a>
          <a href="#exclusividade" className="transition-colors hover:text-gold">
            Exclusividade
          </a>
          <a href="#acesso" className="transition-colors hover:text-gold">
            Acesso
          </a>
        </nav>

        <p className="text-[11px] uppercase tracking-[0.16em] text-silver-dim">
          © {new Date().getFullYear()} Whitaker · Inteligência Financeira
        </p>
      </div>
    </footer>
  )
}
