import { useEffect, useState } from "react";
import API from "../utils/API";
import { useNetwork } from "wagmi";
import { useStore } from "../store/useStore";
import NftCard from "../components/NftCard";
import Spinner from "../components/Spinner";
import ErrorBanner from "../components/ErrorBanner";
import InfoBanner from "../components/InfoBanner.";


function Nfts() {
  const [nfts, setNfts] = useState();
  
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [state, dispatch] = useStore();
  console.log("state: ", state);

  const { activeChain } = useNetwork();
  console.log(activeChain);

  const fetchNftData = async () => {
    setError("");
    setLoading(true);
    try {
        const addr =  state.searchedAddress;
        const res = await API.get(
            `https://api.covalenthq.com/v1/${activeChain.id}/address/${addr}/balances_v2/?nft=true&key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`,
        );

        console.log(res)

        const response_data = res.data.data.items;
      
        const nft_data = response_data.filter(item => item.type === "nft" && item.nft_data);
        setNfts(nft_data);
        console.log(nft_data);
        setLoading(false);
    } catch (e) {
        const message = e.response.data.error_message || e.message;
        setError({message: message})

        console.log(e);
        setLoading(false);
    }
  };

  const displayNfts = () => {
    if(nfts && nfts.length == 0){
        return "No Nft assets found!"
    }
    return nfts.map((nft, i) => {
        if(nft.nft_data[0] && nft.nft_data[0].external_data && nft.nft_data[0].external_data.name){
            const { name, description, image, contract_ticker_symbol, balance } = nft.nft_data[0].external_data;

            return <NftCard key={i} name={name} description={description} image={image} symbol={contract_ticker_symbol} balance={balance}/>
        }
    })
  };

  useEffect(() => {
    setNfts(null);
    state.searchedAddress && fetchNftData();
  },[state, activeChain]);

  if(error){
    return <ErrorBanner error={error}/>
  }

  return (
    <div>
        {
            !state.searchedAddress ? 
            <InfoBanner info={"Enter address in search-bar to view Nfts"}/> : ""
        }
      {loading ? 
        <div className="grid place-items-center items-center">
            <Spinner />
        </div> :
        <div className="nft-grid">
            {nfts ? displayNfts() : ""}
        </div>
      }
    </div>
  );
}

export default Nfts;