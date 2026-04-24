import { useState, useContext, type FormEvent, useCallback } from "react";
import axios, { type AxiosResponse } from "axios";

import {
  RepoConsultingContext,
  type ILastSearchUser,
} from "../contexts/RepoConsultingContext";
import { SearchResult } from "./SearchResult";
import { RepoCards } from "./RepoCards";
import { StarredCards } from "./StarredCards";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserSearchResults } from "./UserSearchResults";

interface GitHubUserSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUserSearchItem[];
}

interface GitHubUserSearchItem {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  score: number;
}

interface GitHubUserResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  type: string;
  email: string | null;
  followers: number;
  company: string | null;
}

const GITHUB_API_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const MAX_USER_RESULTS = 5;

const SEARCH_FILTER_CHIPS = [
  "match: login",
  "type: user",
  "sort: closest",
  "top 5",
];

function mapGitHubUserResponse(res: AxiosResponse<GitHubUserResponse>): ILastSearchUser {
  return {
    login: res.data.login,
    name: res.data.name ?? res.data.login,
    avatar_url: res.data.avatar_url,
    type: res.data.type,
    mail: res.data.email,
    followers: res.data.followers,
    company: res.data.company,
  };
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [userResults, setUserResults] = useState<GitHubUserSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLogin, setSelectedLogin] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const {
    lastSearch,
    insertNewSearch,
    repoIsOpen,
    starredIsOpen,
    activeStarred,
    activeRepo,
  } = useContext(RepoConsultingContext);

  const closeOpenPanels = useCallback(() => {
    if (repoIsOpen) {
      activeRepo();
    }

    if (starredIsOpen) {
      activeStarred();
    }
  }, [activeRepo, activeStarred, repoIsOpen, starredIsOpen]);

  const searchOnGitHub = useCallback(async (): Promise<void> => {
    const normalizedQuery = query.trim();

    if (normalizedQuery === "") {
      return;
    }

    closeOpenPanels();
    setIsSearching(true);
    setStatusMessage("");
    setSearchedQuery(normalizedQuery);
    setSelectedLogin(null);

    try {
      const res = await axios.get<GitHubUserSearchResponse>(
        "https://api.github.com/search/users",
        {
          params: {
            q: `${normalizedQuery} in:login type:user`,
            per_page: MAX_USER_RESULTS,
            page: 1,
          },
          headers: GITHUB_API_HEADERS,
        }
      );
      const nextResults = res.data.items.slice(0, MAX_USER_RESULTS);

      setUserResults(nextResults);
      setStatusMessage(
        nextResults.length === 0 ? "Nenhum usuario encontrado para esta busca." : ""
      );
    } catch {
      setUserResults([]);
      setStatusMessage("Nao foi possivel buscar usuarios agora.");
      toast.error("Nao foi possivel buscar usuarios agora.");
    } finally {
      setIsSearching(false);
    }
  }, [closeOpenPanels, query]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      void searchOnGitHub();
    },
    [searchOnGitHub]
  );

  const handleSelectUser = useCallback(
    async (login: string): Promise<void> => {
      setSelectedLogin(login);
      setStatusMessage("");

      try {
        const res = await axios.get<GitHubUserResponse>(
          `https://api.github.com/users/${login}`
        );

        insertNewSearch(mapGitHubUserResponse(res));
      } catch {
        setStatusMessage("Nao foi possivel abrir este perfil.");
        toast.error("Nao foi possivel abrir este perfil.");
      } finally {
        setSelectedLogin(null);
      }
    },
    [insertNewSearch]
  );

  return (
    <>
      <ToastContainer />
      <section className="mx-auto flex w-full max-w-[920px] flex-col gap-6 rounded-auth-card border border-auth-border bg-auth-card/90 p-5 shadow-auth-card backdrop-blur-md sm:p-8">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="github-user-search"
              className="font-auth-label text-sm font-semibold uppercase tracking-[0.2em] text-auth-text-secondary"
            >
              Usuário do GitHub
            </label>
            <div className="flex gap-3 max-sm:flex-col">
              <input
                id="github-user-search"
                className="min-h-12 flex-1 rounded-auth-control border border-auth-border-strong bg-auth-terminal px-4 py-3 text-base text-auth-text-primary outline-none transition placeholder:text-auth-text-muted focus:border-auth-cyan focus:ring-2 focus:ring-auth-cyan/40"
                type="text"
                placeholder="Pesquise usuários do GitHub"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                className="min-h-12 rounded-auth-control bg-auth-violet px-6 font-auth-label text-sm font-semibold uppercase tracking-[0.18em] text-auth-text-primary shadow-auth-button transition hover:bg-auth-magenta focus-visible:ring-2 focus-visible:ring-auth-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-auth-card focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
                type="submit"
                disabled={isSearching}
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-auth-text-secondary" aria-label="Filtros da busca">
            {SEARCH_FILTER_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-auth-border bg-auth-terminal px-3 py-1"
              >
                {chip}
              </span>
            ))}
          </div>
        </form>

        {searchedQuery && (
          <p className="text-sm text-auth-text-muted">
            Resultados para <span className="text-auth-text-secondary">{searchedQuery}</span>
          </p>
        )}

        {statusMessage && (
          <p role="status" className="rounded-auth-control border border-auth-border bg-auth-terminal px-4 py-3 text-sm text-auth-text-secondary">
            {statusMessage}
          </p>
        )}

        <UserSearchResults
          results={userResults}
          selectedLogin={selectedLogin}
          onSelect={handleSelectUser}
        />

        <div className="flex flex-col items-center">
          {lastSearch && <SearchResult />}
          <RepoCards />
          <StarredCards />
        </div>
      </section>
    </>
  );
}
