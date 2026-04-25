import { createContext, ReactNode, useState, useEffect } from "react";

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

interface RepoConsultingProviderprops {
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

export function RepoConsultingProvider({
  children,
}: RepoConsultingProviderprops) {
  const [isLogged, setIsLogged] = useState(false);
  const [codeUrl, setCodeUrl] = useState("");
  const [tokenTime, setTokenTime] = useState<ITokenTime>();
  const [lastSearch, setLastSearch] = useState<ILastSearchUser>();
  const [repoIsOpen, setRepoisOpen] = useState(false);
  const [starredIsOpen, setStarredIsOpen] = useState(false);

  //repositores settings
  const [repoStorage, setRepoStorage] = useState<ISearchRepo[]>([]);
  //starred settings
  const [starredStorage, setStarredStorage] = useState<ISearchStarred[]>([]);

  useEffect(() => {
    const [, myUrl] = window.location.href.split("=");
    const rigthNow = new Date();

    var nextDate = new Date(rigthNow);
    nextDate.setMinutes(rigthNow.getMinutes() + 10);

    const newDate: ITokenTime = {
      day: nextDate.getDate(),
      month: nextDate.getMonth() + 1,
      year: nextDate.getFullYear(),
      hour: nextDate.getHours(),
      minute: nextDate.getMinutes(),
      second: nextDate.getSeconds(),
    };

    setCodeUrl(() => String(myUrl));
    setTokenTime(newDate);

    setTokenStorage();
  }, [isLogged]);

  function setTokenStorage() {
    const mySettings: IStorage = {
      time: tokenTime,
      token: codeUrl,
    };

    localStorage.setItem("token@myToken", JSON.stringify(mySettings));
  }

  function getTokenStorage() {
    const mySettings = localStorage.getItem("token@myToken");

    // setCodeUrl(() => JSON.parse(mySettings.token))
  }

  async function authentificationWithGibHub() {
    setIsLogged(true);
  }

  async function insertNewSearch(data: ILastSearchUser) {
    await setLastSearch(() => data);
  }

  function activeRepo() {
    setStarredIsOpen(false);
    setRepoisOpen(!repoIsOpen);
  }

  function activeStarred() {
    setRepoisOpen(false);
    setStarredIsOpen(!starredIsOpen);
  }

  async function insertNewRepoStorage(data: ISearchRepo[]) {
    await setRepoStorage(() => data);
  }

  async function insertNewStarredStorage(data: ISearchStarred[]) {
    await setStarredStorage(() => data);
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
