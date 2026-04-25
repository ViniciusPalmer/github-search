import { cn } from "../../lib/utils";

export interface UserRepositoryItem {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count?: number;
  open_issues_count?: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  visibility?: string;
  private?: boolean;
}

interface UserRepositoryCardProps {
  repository: UserRepositoryItem;
  isSelected: boolean;
  onSelect: (repository: UserRepositoryItem) => void;
}

export function UserRepositoryCard({
  repository,
  isSelected,
  onSelect,
}: UserRepositoryCardProps) {
  const language = repository.language ?? "Stack não informada";

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(repository)}
      className={cn(
        "grid min-h-[52px] w-full grid-cols-[minmax(0,1fr)_minmax(92px,128px)] items-center gap-4 rounded-auth-card border p-3 text-left transition focus-visible:ring-2 focus-visible:ring-auth-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-auth-panel focus-visible:outline-none max-sm:grid-cols-1",
        isSelected
          ? "border-auth-violet bg-auth-selected text-auth-text-primary shadow-auth-panel"
          : "border-auth-border bg-auth-terminal/75 text-auth-text-secondary hover:border-auth-border-strong hover:bg-auth-terminal-tile/80"
      )}
    >
      <span className="min-w-0">
        <span className="block truncate font-auth-title text-sm font-semibold text-auth-text-primary">
          {repository.name}
        </span>
        <span className="mt-1 block truncate text-xs text-auth-text-secondary">
          {repository.description ?? "Sem descrição disponível."}
        </span>
      </span>
      <span className="justify-self-end rounded-full border border-auth-border-strong bg-auth-panel px-3 py-1 font-auth-label text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-auth-cyan max-sm:justify-self-start">
        {language} • {repository.stargazers_count} stars
      </span>
    </button>
  );
}
