import { useContext, useEffect } from "react";
import { RepoConsultingContext } from "../contexts/RepoConsultingContext";

export function LoginWithGithub() {
  const { authentificationWithGibHub } = useContext(
    RepoConsultingContext
  );

  useEffect(() => {
    const [, myUrl] = window.location.href.split("=");
    if (myUrl !== "" && myUrl !== null && myUrl !== undefined)
      authentificationWithGibHub();
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-[1.25rem] border-0 bg-surface px-12 py-10 text-brand-text">
        <img className="max-w-60" src="/LogoCompasso.png" alt="Logo Compasso" />
        <a href="https://github.com/login/oauth/authorize?scope=user:email&client_id=494ba751b5d36b9ac67f&redirect_uri=http://localhost:3000/">
          <div className="group flex h-full w-full flex-col items-center">
            <span className="m-10 cursor-pointer transition-transform duration-[800ms] ease-linear group-hover:scale-150">
              Login with GitHub
            </span>
            <img
              className="max-w-20 flex-1 cursor-pointer"
              src="icons/GitHub-Light.png"
              alt="Logo GitHub"
            />
          </div>
        </a>
      </div>
    </div>
  );
}
