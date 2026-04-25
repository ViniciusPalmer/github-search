import type { UserRepositoryItem } from "../UserRepositoryCard/index";

interface SelectedRepositorySummaryProps {
  repository: UserRepositoryItem | null;
  isDefaultSelection?: boolean;
}

export function SelectedRepositorySummary({
  repository,
  isDefaultSelection = false,
}: SelectedRepositorySummaryProps) {
  if (!repository) {
    return (
      <aside
        aria-label="Resumo do repositório selecionado"
        className="rounded-auth-card border border-auth-border bg-auth-panel p-4 text-sm text-auth-text-secondary"
      >
        Selecione um repositório exibido para ver o resumo.
      </aside>
    );
  }

  const topics = repository.topics?.length
    ? repository.topics
    : [repository.language ?? "Sem tópicos"];
  const visibility = repository.private ? "PRIVADO" : "PUBLIC";
  const forks = repository.forks_count ?? 0;

  return (
    <aside
      aria-label="Resumo do repositório selecionado"
      className="flex h-full flex-col rounded-auth-card border border-auth-border-strong bg-auth-terminal-tile p-5 text-auth-text-secondary shadow-auth-panel"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-auth-title text-lg font-semibold text-auth-text-primary">
          Resumo do repositório
        </h2>
        <span className="rounded-full border border-auth-border-strong bg-auth-selected px-3 py-1 font-auth-label text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-auth-cyan">
          {isDefaultSelection ? "SELECIONADO DEFAULT" : "SELECIONADO"}
        </span>
      </div>

      <div className="mt-6">
        <span className="rounded-full border border-auth-border bg-auth-panel px-3 py-1 font-auth-label text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-auth-eyebrow">
          {visibility}
        </span>
        <h3 className="mt-4 font-auth-title text-2xl font-bold text-auth-text-primary">
          {repository.name}
        </h3>
        <p className="mt-3 text-sm leading-6">
          {repository.description ?? "Sem descrição disponível."}
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-2 text-center max-sm:grid-cols-1">
        <div className="rounded-auth-control border border-auth-border bg-auth-panel p-3">
          <dt className="font-auth-label text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-auth-text-muted">
            STARS
          </dt>
          <dd className="mt-1 font-auth-title text-lg font-semibold text-auth-text-primary">
            {repository.stargazers_count}
          </dd>
        </div>
        <div className="rounded-auth-control border border-auth-border bg-auth-panel p-3">
          <dt className="font-auth-label text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-auth-text-muted">
            FORKS
          </dt>
          <dd className="mt-1 font-auth-title text-lg font-semibold text-auth-text-primary">
            {forks}
          </dd>
        </div>
        <div className="rounded-auth-control border border-auth-border bg-auth-panel p-3">
          <dt className="font-auth-label text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-auth-text-muted">
            STACK
          </dt>
          <dd className="mt-1 truncate font-auth-title text-lg font-semibold text-auth-text-primary">
            {repository.language ?? "N/A"}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <p className="font-auth-label text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-auth-text-muted">
          Tópicos
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-auth-border bg-auth-panel px-3 py-1 text-xs text-auth-text-secondary"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <a
        href={repository.html_url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Abrir repositório ${repository.name} no GitHub`}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-auth-control bg-auth-violet px-5 font-auth-label text-xs font-semibold uppercase tracking-[0.18em] text-auth-text-primary shadow-auth-button transition hover:bg-auth-magenta focus-visible:ring-2 focus-visible:ring-auth-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-auth-terminal-tile focus-visible:outline-none"
      >
        Abrir {repository.name}
      </a>
    </aside>
  );
}
