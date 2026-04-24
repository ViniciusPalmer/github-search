import Image from "next/image";

export interface UserResultCardItem {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  score: number;
}

interface UserResultCardProps {
  user: UserResultCardItem;
  isLoading: boolean;
  isDisabled: boolean;
  onSelect: (login: string) => void;
}

export function UserResultCard({
  user,
  isLoading,
  isDisabled,
  onSelect,
}: UserResultCardProps) {
  return (
    <button
      type="button"
      aria-label={`Abrir perfil ${user.login}`}
      disabled={isDisabled}
      onClick={() => onSelect(user.login)}
      className="group flex min-h-20 w-full items-center gap-4 rounded-auth-card border border-auth-border bg-auth-terminal/80 p-4 text-left transition duration-200 hover:border-auth-cyan/70 hover:bg-auth-terminal-tile/90 focus-visible:ring-2 focus-visible:ring-auth-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-auth-panel focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
    >
      <Image
        src={user.avatar_url}
        alt={`Avatar de ${user.login}`}
        width={48}
        height={48}
        unoptimized
        className="h-12 w-12 rounded-full border border-auth-border-strong object-cover shadow-avatar"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-auth-title text-base font-semibold text-auth-text-primary">
          {user.login}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-auth-text-secondary">
          <span>{user.type}</span>
          <span aria-hidden="true">•</span>
          <span>score {user.score.toFixed(2)}</span>
        </span>
      </span>
      <span className="rounded-full border border-auth-border-strong px-3 py-1 font-auth-label text-xs font-semibold uppercase tracking-[0.18em] text-auth-cyan transition group-hover:border-auth-cyan">
        {isLoading ? "Abrindo..." : "Abrir"}
      </span>
    </button>
  );
}
