import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { RepoConsultingContext } from "../../contexts/RepoConsultingContext";
import { SelectedRepositorySummary } from "../SelectedRepositorySummary/index";
import { UserRepositoryList } from "../UserRepositoryList/index";
import type { UserRepositoryItem } from "../UserRepositoryCard/index";

interface UserDetailScreenProps {
  onBack: () => void;
}

function getDisplayedStars(repositories: UserRepositoryItem[]): number {
  return repositories.reduce(
    (totalStars, repository) => totalStars + repository.stargazers_count,
    0
  );
}

function getTopStack(repositories: UserRepositoryItem[]): string {
  const languageCount = new Map<string, number>();

  for (const repository of repositories) {
    if (!repository.language) {
      continue;
    }

    languageCount.set(
      repository.language,
      (languageCount.get(repository.language) ?? 0) + 1
    );
  }

  let topStack = "N/A";
  let topCount = 0;

  for (const [language, count] of languageCount) {
    if (count > topCount) {
      topStack = language;
      topCount = count;
    }
  }

  return topStack;
}

function formatCompactNumber(value: number): string {
  if (value < 1000) {
    return String(value);
  }

  const compactValue = value / 1000;

  return `${compactValue.toFixed(compactValue >= 10 ? 0 : 1).replace(".0", "")}k`;
}

export function UserDetailScreen({ onBack }: UserDetailScreenProps) {
  const { lastSearch } = useContext(RepoConsultingContext);
  const selectedLogin = lastSearch?.login;
  const [repositories, setRepositories] = useState<UserRepositoryItem[]>([]);
  const [selectedRepository, setSelectedRepository] =
    useState<UserRepositoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!selectedLogin) {
      return;
    }

    let isActive = true;

    async function fetchRepositories() {
      setIsLoading(true);
      setErrorMessage("");
      setRepositories([]);
      setSelectedRepository(null);

      try {
        const response = await axios.get<UserRepositoryItem[]>(
          `https://api.github.com/users/${selectedLogin}/repos`,
          {
            params: {
              per_page: 5,
              page: 1,
              sort: "updated",
            },
          }
        );

        if (!isActive) {
          return;
        }

        const displayedRepositories = response.data.slice(0, 5);

        setRepositories(displayedRepositories);
        setSelectedRepository(displayedRepositories[0] ?? null);
      } catch {
        if (isActive) {
          setRepositories([]);
          setErrorMessage("Nao foi possivel buscar os repositórios deste perfil.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void fetchRepositories();

    return () => {
      isActive = false;
    };
  }, [selectedLogin]);

  if (!lastSearch) {
    return (
      <section className="mx-auto w-full max-w-[920px] rounded-auth-card border border-auth-border bg-auth-card/90 p-6 text-auth-text-secondary shadow-auth-card">
        <p>Nenhum perfil selecionado.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-auth-control bg-auth-violet px-5 py-3 font-auth-label text-sm font-semibold uppercase tracking-[0.18em] text-auth-text-primary focus-visible:ring-2 focus-visible:ring-auth-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-auth-card focus-visible:outline-none"
        >
          Voltar para busca
        </button>
      </section>
    );
  }

  const displayedStars = getDisplayedStars(repositories);
  const topStack = getTopStack(repositories);
  const hasPublicRepoCount = typeof lastSearch.public_repos === "number";
  const metricCards = [
    {
      label: "REPOS",
      value: formatCompactNumber(
        hasPublicRepoCount ? lastSearch.public_repos ?? 0 : repositories.length
      ),
      hint: hasPublicRepoCount ? "perfil" : "exibidos",
    },
    {
      label: "STARS",
      value: formatCompactNumber(displayedStars),
      hint: "exibidas",
    },
    {
      label: "MATCHES",
      value: formatCompactNumber(repositories.length),
      hint: "repos",
    },
    {
      label: "TOP STACK",
      value: topStack,
      hint: "exibido",
    },
  ];
  const isDefaultRepositorySelected =
    Boolean(selectedRepository) && selectedRepository?.id === repositories[0]?.id;

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-[22px] rounded-auth-card border border-auth-border bg-auth-card/90 p-5 shadow-auth-card backdrop-blur-md sm:p-[30px]">
      <header className="flex items-start justify-between gap-6 max-lg:flex-col">
        <div className="flex min-w-0 gap-5 max-sm:flex-col">
          <Image
            src={lastSearch.avatar_url}
            alt={`Avatar de ${lastSearch.login}`}
            width={88}
            height={88}
            unoptimized
            className="h-22 w-22 shrink-0 rounded-full border border-auth-border-strong object-cover shadow-avatar"
          />
          <div className="min-w-0">
            <p className="font-auth-label text-xs font-semibold uppercase tracking-[0.2em] text-auth-eyebrow">
              Resultado para usuário {lastSearch.login}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="font-auth-title text-4xl font-bold text-auth-text-primary max-sm:text-3xl">
                {lastSearch.name}
              </h1>
              <span className="rounded-full border border-auth-border bg-auth-terminal px-3 py-1 font-auth-label text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-auth-cyan">
                PUBLIC
              </span>
            </div>
            <p className="mt-1 text-sm text-auth-text-secondary">@{lastSearch.login}</p>
            <p className="mt-4 max-w-[640px] text-sm leading-6 text-auth-text-secondary">
              Perfil GitHub encontrado na busca. Selecione um repositório abaixo para ver o resumo detalhado no painel lateral.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-auth-border bg-auth-terminal px-4 py-2 font-auth-label text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-auth-text-secondary">
          <span className="h-2 w-2 rounded-full bg-auth-cyan shadow-auth-button" aria-hidden="true" />
          PERFIL ATIVO
        </span>
      </header>

      <section
        className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1"
        aria-label="Métricas dos repositórios exibidos"
      >
        {metricCards.map((metric) => (
          <article
            key={metric.label}
            aria-label={`Métrica ${metric.label}: ${metric.value}`}
            className="flex min-h-[100px] flex-col justify-between rounded-auth-card border border-auth-border bg-auth-panel p-[18px]"
          >
            <p className="font-auth-title text-3xl font-bold text-auth-text-primary">
              {metric.value}
            </p>
            <div>
              <p className="font-auth-label text-xs font-semibold uppercase tracking-[0.2em] text-auth-text-muted">
                {metric.label}
              </p>
              <p className="mt-1 text-xs text-auth-text-secondary">{metric.hint}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid min-h-[399px] grid-cols-[minmax(0,710px)_330px] gap-5 max-lg:grid-cols-1">
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <p role="status" className="rounded-auth-control border border-auth-border bg-auth-terminal px-4 py-3 text-sm text-auth-text-secondary">
              Carregando repositórios...
            </p>
          ) : errorMessage ? (
            <p role="alert" className="rounded-auth-control border border-auth-border bg-auth-terminal px-4 py-3 text-sm text-auth-text-secondary">
              {errorMessage}
            </p>
          ) : (
            <UserRepositoryList
              repositories={repositories}
              selectedRepositoryId={selectedRepository?.id ?? null}
              onSelectRepository={setSelectedRepository}
            />
          )}
        </div>

        <SelectedRepositorySummary
          repository={selectedRepository}
          isDefaultSelection={isDefaultRepositorySelected}
        />
      </section>
    </main>
  );
}
