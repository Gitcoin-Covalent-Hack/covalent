import "@rainbow-me/rainbowkit/styles.css";
import StoreProvider from "../store/StoreProvider";
import RainbowKitWrapper from "../components/RainbowKitWrapper";

import "../styles/globals.scss";
import Layout from "../components/Layout";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="light">
      <RainbowKitWrapper>
        <StoreProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StoreProvider>
      </RainbowKitWrapper>
    </ThemeProvider>
  );
}

export default MyApp;
