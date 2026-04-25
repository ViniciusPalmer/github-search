import {
  UserRepositoryCard,
  type UserRepositoryItem,
} from "../UserRepositoryCard/index";

interface UserRepositoryListProps {
  repositories: UserRepositoryItem[];
  selectedRepositoryId: number | null;
  onSelectRepository: (repository: UserRepositoryItem) => void;
}

export function UserRepositoryList({
  repositories,
  selectedRepositoryId,
  onSelectRepository,
}: UserRepositoryListProps) {
  if (repositories.length === 0) {
    return (
      <section className="rounded-auth-card border border-auth-border bg-auth-panel p-4">
        <h2 className="font-auth-title text-lg font-semibold text-auth-text-primary">
          Repositórios do usuário
        </h2>
        <p className="mt-4 rounded-auth-control border border-auth-border bg-auth-terminal px-4 py-3 text-sm text-auth-text-secondary">
          Nenhum repositório encontrado para este perfil.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-auth-card border border-auth-border bg-auth-panel p-4"
      aria-labelledby="user-repositories-title"
    >
      <div className="mb-4">
        <h2 id="user-repositories-title" className="font-auth-title text-lg font-semibold text-auth-text-primary">
          Repositórios do usuário
        </h2>
        <p className="mt-1 text-sm text-auth-text-secondary">
          Primeiro item selecionado por padrão • clique para atualizar o resumo
        </p>
      </div>
      <div className="grid gap-3" aria-label="Repositórios atualizados do usuário selecionado">
        {repositories.map((repository) => (
          <UserRepositoryCard
            key={repository.id}
            repository={repository}
            isSelected={selectedRepositoryId === repository.id}
            onSelect={onSelectRepository}
          />
        ))}
      </div>
    </section>
  );
}
