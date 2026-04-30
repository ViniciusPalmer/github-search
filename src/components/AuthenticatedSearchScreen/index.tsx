import { useState } from "react";

import { useRepoConsultingContext } from "../../contexts/RepoConsultingContext";
import { SearchBar } from "../SearchBar";
import { SearchHero } from "../SearchHero/index";
import { SearchPageShell } from "../SearchPageShell/index";
import { SearchTopNav } from "../SearchTopNav/index";
import { UserDetailScreen } from "../UserDetailScreen/index";

type AuthenticatedView = "search" | "detail";

export function AuthenticatedSearchScreen() {
  const [view, setView] = useState<AuthenticatedView>("search");
  const { lastSearch, logout } = useRepoConsultingContext();

  return (
    <SearchPageShell>
      <SearchTopNav
        showNewSearchAction={view === "detail" && Boolean(lastSearch)}
        onNewSearch={() => setView("search")}
        onLogout={logout}
      />
      {view === "detail" && lastSearch ? (
        <UserDetailScreen onBack={() => setView("search")} />
      ) : (
        <>
          <SearchHero />
          <SearchBar onUserSelected={() => setView("detail")} />
        </>
      )}
    </SearchPageShell>
  );
}
