import "../styles/tailwind.css";

import type { AppProps } from "next/app";
import { RepoConsultingProvider } from "../contexts/RepoConsultingContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RepoConsultingProvider>
      <Component {...pageProps} />
    </RepoConsultingProvider>
  );
}

export default MyApp;
