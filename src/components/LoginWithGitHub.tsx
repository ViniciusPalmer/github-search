import { useContext, useEffect } from "react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";
import { AuthPageShell } from "./AuthPageShell";
import { LoginPlatformCard } from "./LoginPlatformCard";

const GITHUB_OAUTH_URL =
  "https://github.com/login/oauth/authorize?scope=user:email&client_id=494ba751b5d36b9ac67f&redirect_uri=http://localhost:3000/";

export function LoginWithGithub() {
  const { authentificationWithGibHub } = useContext(
    RepoConsultingContext
  );

  useEffect(() => {
    const oauthCode = new URLSearchParams(window.location.search).get("code");

    if (oauthCode) {
      authentificationWithGibHub();
    }
  }, [authentificationWithGibHub]);

  return (
    <AuthPageShell>
      <LoginPlatformCard oauthHref={GITHUB_OAUTH_URL} />
    </AuthPageShell>
  );
}
