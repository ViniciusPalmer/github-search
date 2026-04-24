import axios from "axios";
import { useContext } from "react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";

interface ISearchRepo {
  name: string;
  description: string;
}

interface ISearchStarred {
  name: string;
  description: string;
  owner: IOwnerStarred;
}

interface IOwnerStarred {
  login: string;
  avatar_url: string;
}

interface GitHubRepoResponse {
  name: string;
  description: string;
}

interface GitHubStarredResponse {
  name: string;
  description: string;
  owner: IOwnerStarred;
}

export function SearchResult() {
  const {
    lastSearch,
    activeStarred,
    activeRepo,
    insertNewRepoStorage,
    insertNewStarredStorage,
  } = useContext(RepoConsultingContext);

  async function repoSearch(): Promise<void> {
    activeRepo();

    const res = await axios.get<GitHubRepoResponse[]>(
      `https://api.github.com/users/${lastSearch.login}/repos`
    );

    const templateRes: ISearchRepo[] = res.data.map((repo) => ({
      name: repo.name,
      description: repo.description,
    }));

    await insertNewRepoStorage(templateRes);
  }

  async function starredSearch(): Promise<void> {
    activeStarred();

    const res = await axios.get<GitHubStarredResponse[]>(
      `https://api.github.com/users/${lastSearch.login}/starred`
    );

    const templateStarred: ISearchStarred[] = res.data.map((repo) => ({
      name: repo.name,
      description: repo.description,
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
      },
    }));

    await insertNewStarredStorage(templateStarred);
  }

  return (
    <div className="my-6 flex h-auto w-[30%] cursor-pointer flex-col p-6 pb-6 shadow-result transition duration-500 ease-linear hover:bg-surface-overlay hover:shadow-result-hover max-[720px]:w-full">
      <img
        className="max-w-20 rounded-full shadow-avatar"
        src={lastSearch.avatar_url}
        alt="Avatar GitHub"
      />
      <div className="flex w-full flex-row flex-wrap items-center justify-between px-6 max-[720px]:w-auto">
        <div className="flex w-full flex-row items-center justify-start py-4 max-[720px]:w-auto">
          <span className="px-2 py-[0.2rem] text-[0.8rem] text-brand-title">Nome:</span>
          <h1 className="text-[1.1rem] text-brand-text">{lastSearch.name}</h1>
        </div>
        <div className="flex w-auto flex-row items-center justify-center">
          <span className="px-2 py-[0.2rem] text-[0.8rem] text-brand-title">Tipo de usuário:</span>
          <h2 className="text-base text-brand-text">{lastSearch.type}</h2>
        </div>
        {lastSearch.mail !== null && lastSearch.mail !== undefined && (
          <div className="flex w-auto flex-row items-center justify-center">
            <span className="px-2 py-[0.2rem] text-[0.8rem] text-brand-title">E-mail:</span>
            <h2 className="text-base text-brand-text">{lastSearch.mail}</h2>
          </div>
        )}

        {lastSearch.company !== null && lastSearch.company !== undefined && (
          <div className="flex w-auto flex-row items-center justify-center">
            <span className="px-2 py-[0.2rem] text-[0.8rem] text-brand-title">Empresa:</span>
            <h2 className="text-base text-brand-text">
              {lastSearch.company === undefined
                ? "Não informado"
                : lastSearch.company}
            </h2>
          </div>
        )}

        <div className="flex w-auto flex-row items-center justify-center">
          <span className="px-2 py-[0.2rem] text-[0.8rem] text-brand-title">Seguidores:</span>
          <h2 className="text-base text-brand-text">{lastSearch.followers}</h2>
        </div>

        <div className="flex w-auto flex-row items-center justify-around max-[720px]:w-full max-[720px]:pt-4 max-[720px]:pb-2">
          <div className="m-0.5 max-[720px]:m-0 max-[720px]:w-auto max-[720px]:p-0">
            <button
              className="rounded-[5px] border-0 bg-action p-[0.35rem] text-[1.1rem] font-bold text-app-background outline-none transition duration-1000 ease-out hover:bg-action-hover focus-visible:ring-2 focus-visible:ring-focus-ring"
              onClick={repoSearch}
            >
              Repositores
            </button>
          </div>
          <div className="m-0.5 max-[720px]:m-0 max-[720px]:w-auto max-[720px]:p-0">
            <button
              className="rounded-[5px] border-0 bg-action p-[0.35rem] text-[1.1rem] font-bold text-app-background outline-none transition duration-1000 ease-out hover:bg-action-hover focus-visible:ring-2 focus-visible:ring-focus-ring"
              onClick={starredSearch}
            >
              Starred
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
