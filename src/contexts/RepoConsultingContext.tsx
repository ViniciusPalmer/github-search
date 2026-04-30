import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface RepoConsultingProviderProps {
  children: ReactNode;
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

export interface RepoConsultingContextValue {
  isAuthenticated: boolean;
  lastSearch: ILastSearchUser | undefined;
  startSession: () => void;
  logout: () => void;
  insertNewSearch: (data: ILastSearchUser) => void;
}

export const RepoConsultingContext = createContext<
  RepoConsultingContextValue | undefined
>(undefined);

export function RepoConsultingProvider({
  children,
}: RepoConsultingProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastSearch, setLastSearch] = useState<ILastSearchUser>();

  const startSession = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setLastSearch(undefined);
  }, []);

  const insertNewSearch = useCallback((data: ILastSearchUser) => {
    setLastSearch(data);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      lastSearch,
      startSession,
      logout,
      insertNewSearch,
    }),
    [insertNewSearch, isAuthenticated, lastSearch, logout, startSession]
  );

  return (
    <RepoConsultingContext.Provider value={value}>
      {children}
    </RepoConsultingContext.Provider>
  );
}

export function useRepoConsultingContext() {
  const context = useContext(RepoConsultingContext);

  if (!context) {
    throw new Error(
      "useRepoConsultingContext must be used within RepoConsultingProvider"
    );
  }

  return context;
}
