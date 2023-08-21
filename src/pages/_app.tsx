import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../providers/QueryClient";
import { AuthProvider } from "../contexts/AuthContext";
import { pdfworker } from "../utils/pdfworker";
import "../styles/globals.css";
import "../styles/rounded.head.comet.loader.css";
import "tailwindcss/tailwind.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default MyApp;
