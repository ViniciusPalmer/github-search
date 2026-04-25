import { UserResultCard, type UserResultCardItem } from "../UserResultCard/index";

interface UserSearchResultsProps {
  results: UserResultCardItem[];
  selectedLogin: string | null;
  onSelect: (login: string) => void;
}

export function UserSearchResults({
  results,
  selectedLogin,
  onSelect,
}: UserSearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3" aria-labelledby="github-user-results-title">
      <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
        <div>
          <h2 id="github-user-results-title" className="font-auth-title text-lg font-semibold text-auth-text-primary">
            Perfis encontrados
          </h2>
          <p className="text-sm text-auth-text-secondary">Selecione um perfil para abrir os detalhes</p>
        </div>
        <span className="rounded-full bg-auth-terminal px-3 py-1 text-xs text-auth-text-muted">
          {results.length} de 5
        </span>
      </div>
      <div className="grid gap-3">
        {results.map((user) => (
          <UserResultCard
            key={user.id}
            user={user}
            isLoading={selectedLogin === user.login}
            isDisabled={selectedLogin !== null}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
