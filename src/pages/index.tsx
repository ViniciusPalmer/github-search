import { useContext } from "react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import { LoginWithGithub } from "../components/LoginWithGitHub";
import { AuthenticatedSearchScreen } from "../components/AuthenticatedSearchScreen";

export default function Home() {
  const { isLogged } = useContext(RepoConsultingContext);

  if (!isLogged) {
    return <LoginWithGithub />;
  }

  return <AuthenticatedSearchScreen />;
}
