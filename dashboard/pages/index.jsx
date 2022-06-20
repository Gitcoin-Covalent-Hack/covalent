import { useEffect, useState } from "react";
import { COVALENT_KEY } from "../constants";
import { useStore } from "../store/useStore";
import API from "../utils/API";
import ChainDetails from "../components/ChainDetails";

import Link from "next/link";

export default function Home() {
  // const [add, setAdd] = useState([]);
  // const [address, setAddress] = useState();
  // const [txn, setTxn] = useState();
  // const [portfolio, setPortfolio] = useState([]);
  // const [chains, setChains] = useState([]);
  const [chainItemsData, setChainItemsData] = useState([]);

  const [state, dispatch] = useStore();
  console.log("state: ", state);

  const fetchAllChains = async () => {
    let response = await API.get(`/chains/status/?&key=${COVALENT_KEY}`);
    console.log("chainItems: ", response.data);
    let chainItems = response.data.data.items;
    console.log("chainItems: ", chainItems);
    setChainItemsData(chainItems);
  };

  useEffect(() => {
    void fetchAllChains();
  }, []);

  // mock data
  // const chainItems = [
  //   {
  //     name: "eth-mainnet",
  //     chain_id: "1",
  //     is_testnet: false,
  //     logo_url: "https://www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png",
  //     synced_block_height: 14994809,
  //     synced_blocked_signed_at: "2022-06-20T05:10:16Z",
  //   },
  //   {
  //     name: "eth-kovan",
  //     chain_id: "42",
  //     is_testnet: true,
  //     logo_url: "https://www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png",
  //     synced_block_height: 32274083,
  //     synced_blocked_signed_at: "2022-06-20T05:12:00Z",
  //   },
  // ];

  return (
    <div>
      <div className="text-2xl flex justify-center  w-auto mt-1">
        <h1 className="font-bold">All Chains</h1>
      </div>
      <ChainDetails chainItems={chainItemsData} />

      <Link href="/GasCalculator">
        <a style={{ fontSize: 40, color: "cyan", border: "2px solid black", padding: 10 }}>Gas Guzzler</a>
      </Link>
    </div>
  );
}
