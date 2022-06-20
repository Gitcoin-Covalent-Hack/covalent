import StoreProvider from "../store/StoreProvider";

import "../styles/globals.scss";
import Layout from "../components/Layout";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="light">
      <StoreProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StoreProvider>
    </ThemeProvider>
  );
}

export default MyApp;
