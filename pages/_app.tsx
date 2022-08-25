import "../styles/globals.scss";
import type { AppProps } from "next/app";
import ContextWrapper from "../context/ContextWrapper";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ContextWrapper>
      <Component {...pageProps} />
    </ContextWrapper>
  );
};

export default MyApp;
