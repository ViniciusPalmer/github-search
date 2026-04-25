interface SearchTopNavProps {
  showNewSearchAction?: boolean;
  onNewSearch?: () => void;
}

export function SearchTopNav({
  showNewSearchAction = false,
  onNewSearch,
}: SearchTopNavProps) {
  return (
    <nav className="flex w-full items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-auth-card border border-auth-border-strong bg-[linear-gradient(135deg,var(--color-auth-violet),var(--color-auth-magenta)_54%,var(--color-auth-cyan))] shadow-auth-panel"
        >
          <span className="h-3 w-3 rounded-full bg-auth-text-primary/90 shadow-auth-button" />
        </div>
        <div>
          <p className="font-auth-label text-xs font-semibold uppercase tracking-[0.28em] text-auth-eyebrow">
            github-search
          </p>
          <p className="text-sm text-auth-text-secondary">
            {showNewSearchAction ? "Resultados GitHub" : "Consultoria de perfis"}
          </p>
        </div>
      </div>
      {showNewSearchAction ? (
        <button
          type="button"
          onClick={onNewSearch}
          className="rounded-auth-control border border-auth-border-strong bg-auth-terminal/80 px-5 py-3 font-auth-label text-xs font-semibold uppercase tracking-[0.22em] text-auth-cyan shadow-auth-panel transition hover:border-auth-cyan hover:text-auth-text-primary focus-visible:ring-2 focus-visible:ring-auth-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-auth-bg-mid focus-visible:outline-none"
        >
          Nova busca
        </button>
      ) : (
        <span className="rounded-full border border-auth-border-strong bg-auth-terminal/80 px-4 py-2 font-auth-label text-xs font-semibold uppercase tracking-[0.24em] text-auth-cyan shadow-auth-panel">
          LOGADO COM GITHUB
        </span>
      )}
    </nav>
  );
}
