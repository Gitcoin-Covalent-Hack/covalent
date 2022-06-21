import { Chain, chain } from "wagmi";

// define your target names in root .env file inside NEXT_PUBLIC_TARGET_NETWORKS variable
const TARGATED_CHAINS = [...process.env.NEXT_PUBLIC_TARGET_NETWORKS.split(",")];

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
