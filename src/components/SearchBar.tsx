import { useRef, useState, type FormEvent } from "react";
import axios, { type AxiosResponse } from "axios";

import {
  type ILastSearchUser,
  useRepoConsultingContext,
} from "../contexts/RepoConsultingContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserSearchResults } from "./UserSearchResults/index";

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
  public_repos?: number;
}

const GITHUB_API_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const USERS_PER_PAGE = 10;
const MAX_GITHUB_SEARCH_RESULTS = 1000;
const FIRST_PAGE = 1;

const SEARCH_FILTER_CHIPS = [
  "match: login",
  "type: user",
  "best match",
  "top 10",
];

interface LoadSearchPageOptions {
  preserveResults?: boolean;
}

interface SearchBarProps {
  onUserSelected?: () => void;
}

function mapGitHubUserResponse(res: AxiosResponse<GitHubUserResponse>): ILastSearchUser {
  const user: ILastSearchUser = {
    login: res.data.login,
    name: res.data.name ?? res.data.login,
    avatar_url: res.data.avatar_url,
    type: res.data.type,
    mail: res.data.email,
    followers: res.data.followers,
    company: res.data.company,
  };

  if (typeof res.data.public_repos === "number") {
    return {
      ...user,
      public_repos: res.data.public_repos,
    };
  }

  return user;
}

export function SearchBar({ onUserSelected }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [userResults, setUserResults] = useState<GitHubUserSearchItem[]>([]);
  const [currentPage, setCurrentPage] = useState(FIRST_PAGE);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLogin, setSelectedLogin] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const latestSearchRequestId = useRef(0);
  const { insertNewSearch } = useRepoConsultingContext();

  const totalPages =
    totalResults === 0 ? 0 : Math.ceil(totalResults / USERS_PER_PAGE);

  async function loadSearchPage(
    normalizedQuery: string,
    page: number,
    options: LoadSearchPageOptions = {}
  ): Promise<void> {
    const requestId = latestSearchRequestId.current + 1;

    latestSearchRequestId.current = requestId;
    setIsSearching(true);
    setStatusMessage("");

    try {
      const res = await axios.get<GitHubUserSearchResponse>(
        "https://api.github.com/search/users",
        {
          params: {
            q: `${normalizedQuery} in:login type:user`,
            per_page: USERS_PER_PAGE,
            page,
          },
          headers: GITHUB_API_HEADERS,
        }
      );
      const nextResults = res.data.items.slice(0, USERS_PER_PAGE);
      const nextTotalResults = Math.min(
        res.data.total_count,
        MAX_GITHUB_SEARCH_RESULTS
      );

      if (requestId !== latestSearchRequestId.current) {
        return;
      }

      setUserResults(nextResults);
      setSearchedQuery(normalizedQuery);
      setCurrentPage(page);
      setTotalResults(nextTotalResults);
      setStatusMessage(
        nextResults.length === 0 ? "Nenhum usuario encontrado para esta busca." : ""
      );
    } catch (error) {
      if (requestId !== latestSearchRequestId.current) {
        return;
      }

      if (!options.preserveResults) {
        setUserResults([]);
        setTotalResults(0);
      }

      const statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;
      const nextStatusMessage =
        statusCode === 403 || statusCode === 429
          ? "Limite de buscas temporariamente atingido. Tente novamente em instantes."
          : "Nao foi possivel buscar usuarios agora.";

      setStatusMessage(nextStatusMessage);
      toast.error(nextStatusMessage);
    } finally {
      if (requestId === latestSearchRequestId.current) {
        setIsSearching(false);
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (isSearching) {
      return;
    }

    const normalizedQuery = query.trim().slice(0, 100);

    if (normalizedQuery === "") {
      return;
    }

    setSelectedLogin(null);
    setSearchedQuery(normalizedQuery);
    setCurrentPage(FIRST_PAGE);
    setTotalResults(0);
    setUserResults([]);

    void loadSearchPage(normalizedQuery, FIRST_PAGE);
  }

  function handlePageChange(page: number): void {
    if (
      isSearching ||
      searchedQuery === "" ||
      page < FIRST_PAGE ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    void loadSearchPage(searchedQuery, page, { preserveResults: true });
  }

  async function handleSelectUser(login: string): Promise<void> {
    setSelectedLogin(login);
    setStatusMessage("");

    try {
      const res = await axios.get<GitHubUserResponse>(
        `https://api.github.com/users/${login}`
      );

      insertNewSearch(mapGitHubUserResponse(res));
      onUserSelected?.();
    } catch {
      setStatusMessage("Nao foi possivel abrir este perfil.");
      toast.error("Nao foi possivel abrir este perfil.");
    } finally {
      setSelectedLogin(null);
    }
  }

  return (
    <>
      <ToastContainer />
      <section className="mx-auto flex w-full max-w-[920px] flex-col gap-6 overflow-hidden rounded-auth-card border border-auth-border bg-auth-card/90 p-5 shadow-auth-card backdrop-blur-md sm:p-8">
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
                maxLength={100}
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
          currentPage={currentPage}
          totalResults={totalResults}
          pageSize={USERS_PER_PAGE}
          isLoading={isSearching}
          selectedLogin={selectedLogin}
          onSelect={handleSelectUser}
          onPageChange={handlePageChange}
        />

      </section>
    </>
  );
}
