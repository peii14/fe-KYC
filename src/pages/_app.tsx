import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

import "regenerator-runtime/runtime";

const supportedChainIds = [1, 4, 137];

const connectors = {
  injected: {},
};
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <Component {...pageProps} />
    </ThirdwebWeb3Provider>
  );
}
