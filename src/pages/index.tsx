import Head from "next/head";
import { AuthenticatedSearchScreen } from "../components/AuthenticatedSearchScreen";
import { LoggedOutLandingScreen } from "../components/LoggedOutLandingScreen";
import { useRepoConsultingContext } from "../contexts/RepoConsultingContext";

export default function Home() {
  const { isAuthenticated } = useRepoConsultingContext();

  return (
    <>
      <Head>
        <title>github-search</title>
      </Head>
      {isAuthenticated ? <AuthenticatedSearchScreen /> : <LoggedOutLandingScreen />}
    </>
  );
}
