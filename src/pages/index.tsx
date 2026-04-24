import { useContext } from "react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import { LoginWithGithub } from "../components/LoginWithGitHub";
import { SearchBar } from "../components/SearchBar";

export default function Home() {
  const { isLogged } = useContext(RepoConsultingContext);

  if (!isLogged) {
    return <LoginWithGithub />;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div>
        <SearchBar />
      </div>
    </div>
  );
}
