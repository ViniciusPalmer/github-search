import Head from "next/head";
import { useContext } from "react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import { LoginWithGithub } from "../components/LoginWithGitHub";
import { AuthenticatedSearchScreen } from "../components/AuthenticatedSearchScreen";

export default function Home() {
  const { isLogged } = useContext(RepoConsultingContext);

  if (!isLogged) {
    return (
      <>
        <Head>
          <title>github-search</title>
        </Head>
        <LoginWithGithub />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>github-search</title>
      </Head>
      <AuthenticatedSearchScreen />
    </>
  );
}
