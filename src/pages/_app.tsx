import "../styles/tailwind.css";
import "../styles/global.scss";

import { RepoConsultingProvider } from "../contexts/RepoConsultingContext";

function MyApp({ Component, pageProps }) {
  return (
    <RepoConsultingProvider>
      <Component {...pageProps} />
    </RepoConsultingProvider>
  );
}

export default MyApp;
