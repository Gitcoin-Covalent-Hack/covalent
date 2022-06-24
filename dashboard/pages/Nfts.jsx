import { useEffect, useState } from "react";
import API from "../utils/API";
import { useNetwork } from "wagmi";
import { useStore } from "../store/useStore";
import NftCard from "../components/NftCard";


function Nfts() {
  const [data, setData] = useState();
  
  const [loading, setLoading] = useState(false);

  const [state, dispatch] = useStore();
  console.log("state: ", state);

  const { activeChain } = useNetwork();
  console.log(activeChain);

  const fetchNftData = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `https://api.covalenthq.com/v1/${activeChain.id}/address/${state.searchedAddress || state.address}/balances_v2/?nft=true&page-size=10&key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`,
      );

      const response_data = res.data.data.items;
      
      const nft_data = response_data.filter(item => item.type === "nft");
      setData(nft_data);
      console.log(nft_data);
      
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const displayNfts = (nfts) => {
    return nfts.map(nft => {
        if(nft.nft_data){
            return <NftCard />
        }
    })
  };

  useEffect(() => {
    fetchNftData();
  },[]);

  return (
    <div>
      {loading ? <p>Loading...</p> : ""}
      {
        data ? displayNfts(data) : ""
      }
    </div>
  );
}

export default Nfts;

const temp =             {
    "token_id": "127",
    "token_balance": "1",
    "token_url": "ipfs://QmZFiD6tTTZRFMv4kumKuiqaHXbPBaQLVNs6nTGY74vZEG/0",
    "supports_erc": [
        "erc20",
        "erc721"
    ],
    "token_price_wei": null,
    "token_quote_rate_eth": null,
    "original_owner": "0xb1898a42cfe1a82f9a8c363e48ce05394c64fe70",
    "external_data": {
        "name": null,
        "description": null,
        "image": null,
        "image_256": null,
        "image_512": null,
        "image_1024": null,
        "animation_url": null,
        "external_url": "ipfs://QmZFiD6tTTZRFMv4kumKuiqaHXbPBaQLVNs6nTGY74vZEG/0",
        "attributes": null,
        "owner": null
    },
    "owner": "0xb1898a42cfe1a82f9a8c363e48ce05394c64fe70",
    "owner_address": null,
    "burned": null
}