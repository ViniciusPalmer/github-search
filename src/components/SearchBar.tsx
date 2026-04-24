import { useState, useContext, type KeyboardEvent } from "react";
import axios, { type AxiosResponse } from "axios";

import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import { BsSearch } from "react-icons/bs";
import { LoadingScreen } from "./LoadingScreen";
import { SearchResult } from "./SearchResult";
import { RepoCards } from "./RepoCards";
import { StarredCards } from "./StarredCards";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ILastSearchUser {
  login: string;
  name: string;
  avatar_url: string;
  type: string;
  mail: string;
  followers: number;
  company: string;
}

interface GitHubUserResponse {
  login: string;
  name: string;
  avatar_url: string;
  type: string;
  email: string;
  followers: number;
  company: string;
}

export function SearchBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [dirName, setDirName] = useState("");
  const {
    lastSearch,
    insertNewSearch,
    repoIsOpen,
    starredIsOpen,
    activeStarred,
    activeRepo,
  } = useContext(RepoConsultingContext);

  function execTask(res: AxiosResponse<GitHubUserResponse>): void {
    const templateRes: ILastSearchUser = {
      login: res.data.login,
      name: res.data.name,
      avatar_url: res.data.avatar_url,
      type: res.data.type,
      mail: res.data.email,
      followers: res.data.followers,
      company: res.data.company,
    };
    insertNewSearch(templateRes);
  }

  async function serchOnGit(): Promise<void> {
    if (repoIsOpen) {
      activeRepo();
    }

    if (starredIsOpen) {
      activeStarred();
    }

    if (dirName !== "") {
      setIsLoading(true);

      await axios
        .get<GitHubUserResponse>(`https://api.github.com/users/${dirName}`)
        .then((res) => execTask(res))
        .catch(() => toast.error("Ops cadastro não encontrado"));
      setIsLoading(false);
    }
  }

  function handleSearchInputKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ): void {
    if (event.key !== "Enter") {
      return;
    }

    void serchOnGit();
  }

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-20 w-[95vw] max-w-[50rem] flex-col items-center justify-center bg-surface py-8 max-[720px]:w-screen max-[720px]:rounded-none max-[720px]:px-8">
        {isLoading && <LoadingScreen />}
        <div className="flex h-full w-full flex-row items-center justify-center max-[720px]:justify-start max-[720px]:px-2">
          <input
            className="h-1/4 w-[85%] rounded-[10px] border border-border-line bg-transparent px-2 py-4 text-[1.2rem] text-brand-text transition duration-300 ease-linear outline-none focus:border-focus-ring max-[720px]:w-full"
            type="text"
            placeholder="Pesquise um perfil do GitHub"
            onChange={(e) => setDirName(e.target.value)}
            onKeyDown={handleSearchInputKeyDown}
          />
          <button
            aria-label="Pesquisar perfil do GitHub"
            className="-ml-11 flex h-11 w-11 items-center justify-center rounded-full transition duration-[800ms] ease-linear focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none"
            onClick={serchOnGit}
            type="button"
          >
            <BsSearch aria-hidden="true" size={15} color="white" />
          </button>
        </div>
        {lastSearch && <SearchResult />}
        <RepoCards />
        <StarredCards />
      </div>
    </>
  );
}
