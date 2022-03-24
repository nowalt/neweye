import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";

import "../client/styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-center" />
    </>
  );
}

export default MyApp;
