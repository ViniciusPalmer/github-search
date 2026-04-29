import { createContext, type ReactNode, useState } from "react";

interface RepoConsultingContext {
  isLogged: boolean;
  lastSearch: ILastSearchUser | undefined;
  repoIsOpen: boolean;
  starredIsOpen: boolean;
  insertNewSearch: (data: ILastSearchUser) => void;
  authentificationWithGibHub: () => void;
  activeRepo: () => void;
  activeStarred: () => void;

  repoStorage: ISearchRepo[];
  starredStorage: ISearchStarred[];

  insertNewRepoStorage: (data: ISearchRepo[]) => void;
  insertNewStarredStorage: (data: ISearchStarred[]) => void;
}

interface RepoConsultingProviderProps {
  children: ReactNode;
}

interface ITokenTime {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second: number;
}

interface IStorage {
  time: ITokenTime;
  token: string;
}

export interface ILastSearchUser {
  login: string;
  name: string;
  avatar_url: string;
  type: string;
  mail: string | null;
  followers: number;
  company: string | null;
  public_repos?: number;
}

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

export const RepoConsultingContext = createContext({} as RepoConsultingContext);

function setTokenStorage(token: string) {
  const rightNow = new Date();
  const nextDate = new Date(rightNow);
  nextDate.setMinutes(rightNow.getMinutes() + 10);

  const tokenSettings: IStorage = {
    time: {
      day: nextDate.getDate(),
      month: nextDate.getMonth() + 1,
      year: nextDate.getFullYear(),
      hour: nextDate.getHours(),
      minute: nextDate.getMinutes(),
      second: nextDate.getSeconds(),
    },
    token,
  };

  localStorage.setItem("token@myToken", JSON.stringify(tokenSettings));
}

export function RepoConsultingProvider({
  children,
}: RepoConsultingProviderProps) {
  const [isLogged, setIsLogged] = useState(false);
  const [lastSearch, setLastSearch] = useState<ILastSearchUser>();
  const [repoIsOpen, setRepoisOpen] = useState(false);
  const [starredIsOpen, setStarredIsOpen] = useState(false);

  //repositores settings
  const [repoStorage, setRepoStorage] = useState<ISearchRepo[]>([]);
  //starred settings
  const [starredStorage, setStarredStorage] = useState<ISearchStarred[]>([]);

  function authentificationWithGibHub() {
    const oauthCode = new URLSearchParams(window.location.search).get("code");

    if (oauthCode) {
      setTokenStorage(oauthCode);
    }

    setIsLogged(true);
  }

  function insertNewSearch(data: ILastSearchUser) {
    setLastSearch(() => data);
  }

  function activeRepo() {
    setStarredIsOpen(false);
    setRepoisOpen(!repoIsOpen);
  }

  function activeStarred() {
    setRepoisOpen(false);
    setStarredIsOpen(!starredIsOpen);
  }

  function insertNewRepoStorage(data: ISearchRepo[]) {
    setRepoStorage(() => data);
  }

  function insertNewStarredStorage(data: ISearchStarred[]) {
    setStarredStorage(() => data);
  }

  return (
    <RepoConsultingContext.Provider
      value={{
        isLogged,
        lastSearch,
        repoIsOpen,
        starredIsOpen,
        insertNewSearch,
        authentificationWithGibHub,
        activeRepo,
        activeStarred,

        repoStorage,
        starredStorage,

        insertNewRepoStorage,
        insertNewStarredStorage,
      }}
    >
      {children}
    </RepoConsultingContext.Provider>
  );
}
