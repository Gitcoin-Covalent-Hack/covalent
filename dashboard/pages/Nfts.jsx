import { useEffect, useState } from "react";
import API from "../utils/API";
import { useNetwork } from "wagmi";
import { useStore } from "../store/useStore";
import NftCard from "../components/NftCard";


function Nfts() {
  const [nfts, setNfts] = useState();
  
  const [loading, setLoading] = useState(false);

  const [state, dispatch] = useStore();
  console.log("state: ", state);

  const { activeChain } = useNetwork();
  console.log(activeChain);

  const fetchNftData = async () => {
    setLoading(true);
    try {
        const addr =  state.searchedAddress || state.address || "demo.eth";
      const res = await API.get(
        `https://api.covalenthq.com/v1/${activeChain.id}/address/${addr}/balances_v2/?nft=true&page-size=10&key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`,
      );

      const response_data = res.data.data.items;
      
      const nft_data = response_data.filter(item => item.type === "nft" && item.nft_data);
      setNfts(nft_data);
      console.log(nft_data);

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const displayNfts = () => {
    if(nfts && nfts.length == 0){
        return <p>No Nft assets found!</p>
    }
    return nfts.map((nft, i) => {
        if(nft.nft_data[0] && nft.nft_data[0].external_data){
            const { name, description, image, contract_ticker_symbol, balance } = nft.nft_data[0].external_data;

            return <NftCard key={i} name={name} description={description} image={image} symbol={contract_ticker_symbol} balance={balance}/>
        }
    })
  };

  useEffect(() => {
    fetchNftData();
  },[state, activeChain]);

  return (
    <div>
      {loading ? 
        <p>Loading...</p> :
        <div className="nft-grid">
            {nfts ? displayNfts() : ""}
        </div>
      }
    </div>
  );
}

export default Nfts;

const temp =             [
    {
        "token_id": "8987",
        "token_balance": "1",
        "token_url": "https://yieldguild.io/api/badge/8987",
        "supports_erc": [
            "erc20",
            "erc721"
        ],
        "token_price_wei": null,
        "token_quote_rate_eth": null,
        "original_owner": "0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de",
        "external_data": {
            "name": "Yield Guild Badge #8987",
            "description": "Your key into the metaverse",
            "image": "https://storage.googleapis.com/ygg_images/badge.mp4",
            "image_256": "https://image-proxy.svc.prod.covalenthq.com/cdn-cgi/image/width=256,fit/https://storage.googleapis.com/ygg_images/badge.mp4",
            "image_512": "https://image-proxy.svc.prod.covalenthq.com/cdn-cgi/image/width=512,fit/https://storage.googleapis.com/ygg_images/badge.mp4",
            "image_1024": "https://image-proxy.svc.prod.covalenthq.com/cdn-cgi/image/width=1024,fit/https://storage.googleapis.com/ygg_images/badge.mp4",
            "animation_url": "https://storage.googleapis.com/ygg_images/badge.mp4",
            "external_url": null,
            "attributes": [],
            "owner": null
        },
        "owner": "0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de",
        "owner_address": null,
        "burned": null
    }
]