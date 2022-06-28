import { chain } from "wagmi";

// add your target  network names
// const TARGATED_CHAINS = ["hardhat", "rinkeby", "mainnet"];
const TARGATED_CHAINS = [...Object.keys(chain)];

export const targetNetowrks = (requiredChains) => {
  const targetedChains = [];
  //   type chainNameType = keyof typeof chain;

  Object.keys(chain).forEach((chainName) => {
    if (requiredChains.includes(chainName)) {
      targetedChains.push(chain[chainName]);
    }
  });
  return targetedChains;
};

export const targedChains = targetNetowrks([...TARGATED_CHAINS]);
