import { ThirdwebWeb3Provider } from "@3rdweb/hooks";
import "@/styles/globals.css";

import "regenerator-runtime/runtime";
import { AppProps } from "next/app";

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
