import Image from "next/image";

export function SearchTopNav() {
  return (
    <nav className="flex w-full items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-auth-card border border-auth-border-strong bg-auth-card shadow-auth-panel">
          <Image
            src="/LogoCompasso.png"
            alt="Compasso"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        </div>
        <div>
          <p className="font-auth-label text-xs font-semibold uppercase tracking-[0.28em] text-auth-eyebrow">
            GitHub Search
          </p>
          <p className="text-sm text-auth-text-secondary">Consultoria de perfis</p>
        </div>
      </div>
      <span className="rounded-full border border-auth-border-strong bg-auth-terminal/80 px-4 py-2 font-auth-label text-xs font-semibold uppercase tracking-[0.24em] text-auth-cyan shadow-auth-panel">
        LOGADO COM GITHUB
      </span>
    </nav>
  );
}
