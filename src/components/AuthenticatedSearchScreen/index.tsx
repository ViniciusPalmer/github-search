import { SearchBar } from "../SearchBar";
import { SearchHero } from "../SearchHero";
import { SearchPageShell } from "../SearchPageShell";
import { SearchTopNav } from "../SearchTopNav";

export function AuthenticatedSearchScreen() {
  return (
    <SearchPageShell>
      <SearchTopNav />
      <SearchHero />
      <SearchBar />
    </SearchPageShell>
  );
}
