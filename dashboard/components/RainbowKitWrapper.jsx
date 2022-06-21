import { darkTheme, getDefaultWallets, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { targedChains } from "../configs/app.config";

const RainbowKitWrapper = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(lightTheme());

  const [chains, setChains] = useState();
  const [provider, setProvider] = useState();
  const [wagmiClient, setWagmiClient] = useState(undefined);

  /**----------------------
   * load rainbow confgs
   * ---------------------*/
  useEffect(() => {
    const { chains, provider } = configureChains([...targedChains], [publicProvider()]);
    setChains(chains);

    const { connectors } = getDefaultWallets({
      appName: "My RainbowKit App",
      chains,
    });

    const wagmiClient = createClient({
      autoConnect: true,
      connectors,
      provider,
    });
    setWagmiClient(wagmiClient);
  }, []);

  // set current rainbow theme
  useEffect(() => {
    if (theme === "light") {
      setCurrentTheme(lightTheme());
    }

    if (theme === "dark") {
      setCurrentTheme(darkTheme());
    }
  }, [theme]);

  return (
    <div>
      {wagmiClient !== undefined && (
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={currentTheme}>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      )}
    </div>
  );
};
export default RainbowKitWrapper;
