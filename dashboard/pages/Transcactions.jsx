import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useBalance, useEnsAddress, useEnsName, useNetwork } from "wagmi";
import { BsCalendar2Event } from "react-icons/bs";

import { COVALENT_KEY } from "../constants";
import { useStore } from "../store/useStore";
import API from "../utils/API";

const EventLogModal = ({ eventLogData, isOpen, setToggleModal }) => {
  console.log("eventLogData: ", eventLogData);
  const { log_events, tx_hash } = eventLogData;
  return (
    <>
      {/* <label htmlFor="my-modal" className="btn modal-button">
        open modal
      </label> */}

      <input type="checkbox" id="my-modal" className="modal-toggle" checked={isOpen} onChange={() => null} />
      <div className="modal  w-full ">
        <div className="modal-box relative w-[100%]">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setToggleModal(!isOpen)}>
            ✕
          </label>

          <h3 className="font-bold text-lg">Event log : {tx_hash.slice(0, 4) + ".." + tx_hash.slice(-4)}</h3>
          <div className="my-2">
            {log_events.map(({ sender_address, sender_name, sender_logo_url, decoded, sender_address_label }) => (
              <>
                <div
                  tabIndex="0"
                  className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box m-2">
                  <div className="collapse-title text-xl font-medium flex justify-between ">
                    <div>
                      {sender_address_label ? sender_address_label : "N/A"} {"=>"}{" "}
                      <span className="badge badge-md bg-slate-400 border-0">
                        {sender_address.slice(0, 4) + ".." + sender_address.slice(-4)}
                      </span>
                    </div>
                    <div className="w-7">{sender_logo_url && <img src={sender_logo_url} alt="" />}</div>
                  </div>
                  {/* collapse content */}
                  <div className="collapse-content">
                    <div className="overflow-x-auto">
                      {decoded && (
                        <table className="table w-full">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Event Name</td>
                              <td>{decoded && decoded["name"]}</td>
                            </tr>

                            <tr>
                              <td>Signature</td>
                              <td className="flex flex-wrap">{decoded && decoded["signature"]}</td>
                            </tr>
                            {decoded &&
                              decoded["params"].map(({ name, value, type }, index) => {
                                console.log("value: ", type === "uint256", value);
                                return (
                                  <tr key={index}>
                                    <td>{name}</td>
                                    <td>
                                      {type === "uint256" && value !== null
                                        ? Number(ethers.utils.formatEther(value)).toFixed(2)
                                        : value}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      )}

                      {!decoded && (
                        <>
                          <div className="alert alert-warning shadow-lg">No event data !!</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
          {/* <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              Yay!
            </label>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default function TranscactionsPage() {
  //TODO:make it dynamic from page
  const DEFAULT_PAGE_SIZE = 10;

  const [txData, setTxData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataCompleted, setDataCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadError, setIsLoadError] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);
  const [toggleModal, setToggleModal] = useState(false);
  const [currentLogEventData, setCurrentLogEventData] = useState(false);

  const [state, dispatch] = useStore();

  //   dynamic render variables
  const finalAddress = state.searchedAddress ? state.searchedAddress : state.address;

  const { activeChain } = useNetwork();
  const { data: balanceData } = useBalance({
    addressOrName: finalAddress,
  });

  const { data: ensName, error: ensNameError } = useEnsName({
    address: finalAddress.includes(".eth") === false && finalAddress,
  });

  const { data: ensAddress, error: ensAddressError } = useEnsAddress({
    name: finalAddress.includes(".eth") && finalAddress,
  });

  const fetchTxData = async (address, chainId, pageNumber, pageSize) => {
    try {
      // console.log("load tx data for  ", address, chainId);
      let response = await API.get(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/transactions_v2/?key=${COVALENT_KEY}&page-size=${pageSize}&page-number=${pageNumber}&no-logs=false`
      );

      let txItems = response.data.data.items;
      console.log("txItems: ", txItems);
      let hasData = response.data.data.pagination.has_more;
      setDataCompleted(!hasData);
      setTxData(txItems);
      setIsLoading(false);
    } catch (error) {
      setIsLoadError(true);
    }
  };

  const onNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const onPreviousPage = () => {
    setPageNumber(pageNumber > 1 ? pageNumber - 1 : 1);
    setDataCompleted(false);
  };

  const fetchEthUsdPrice = async (oldUsdPrice) => {
    let response = await API.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    let usdPrice = response.data.ethereum.usd;
    // console.log("usdPrice: ", usdPrice, oldUsdPrice);
    if (oldUsdPrice !== usdPrice) {
      setEthPrice((previousPrice) => usdPrice);
    }

    setTimeout(() => {
      void fetchEthUsdPrice(usdPrice);
    }, 10000);
  };

  useEffect(() => {
    void fetchEthUsdPrice(0);
  }, []);

  // fetch tx data page wise
  useEffect(() => {
    setIsLoadError(false);
    setIsLoading(true);
    if (activeChain && state.address && activeChain.id > 0) {
      void fetchTxData(state.address, activeChain.id, pageNumber, DEFAULT_PAGE_SIZE);
    }
    if (activeChain && state.searchedAddress && activeChain.id > 0) {
      // check searchedAddress is a valid address
      if (state.searchedAddress.length == 42 || state.searchedAddress.includes(".eth")) {
        void fetchTxData(state.searchedAddress, activeChain.id, pageNumber, DEFAULT_PAGE_SIZE);
      }
    }

    if (!activeChain) {
      setIsLoadError(true);
      setIsLoading(false);
    }
  }, [pageNumber, state.address, state.searchedAddress, activeChain && activeChain.id]);

  return (
    <>
      {toggleModal && (
        <EventLogModal isOpen={toggleModal} eventLogData={currentLogEventData} setToggleModal={setToggleModal} />
      )}

      {/* basic info  */}
      <div className="w-auto my-2">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">Eth price</div>
            <div className="stat-value">${ethPrice}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">Balance</div>
            <div className="stat-value">{balanceData ? Number(balanceData.formatted).toFixed(2) : 0} Eth</div>
            <div className="stat-desc">
              ${balanceData ? Number(Number(balanceData.formatted) * ethPrice).toFixed(2) : 0}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">User</div>
            {/* <div className="stat-value">{finalAddress.slice(0, 4) + "..." + finalAddress.slice(-4)}</div> */}
            <div className="stat-value">
              {ensAddress
                ? ensAddress.slice(0, 4) + "..." + ensAddress.slice(-4)
                : finalAddress.slice(0, 4) + "..." + finalAddress.slice(-4)}
            </div>
            <div className="stat-desc">{finalAddress.includes(".eth") ? finalAddress : ensName}</div>
          </div>
        </div>
      </div>

      {/* table data */}
      {/* <div className="divider">Transcaction</div> */}

      <div className="overflow-x-auto w-full mt--5  flex justify-center items-end flex-col">
        <div className="btn-group m-2 ">
          <button className="btn btn-ghost btn-outline" onClick={onPreviousPage}>
            «
          </button>
          <button className="btn btn-ghost">Page {pageNumber}</button>
          <button className="btn btn-ghost btn-outline" onClick={onNextPage} disabled={dataCompleted}>
            »
          </button>
        </div>
        {isLoading && <progress className="progress w-56 progress-primary relative top-56 right-96 z-50"></progress>}
        <table className={`table w-full  table-normal ${isLoading && "blur-sm"}`}>
          <thead>
            <tr>
              <th></th>
              <th>tx hash</th>
              <th>from</th>
              <th></th>
              <th>to</th>
              <th>value</th>
              <th>fees</th>
              <th>date</th>
              <th>event log</th>
            </tr>
          </thead>
          <tbody>
            {txData.length > 0 &&
              txData
                // .filter((data) => data.value > 0)
                .map(
                  (
                    { tx_hash, from_address, to_address, value, successful, fees_paid, block_signed_at, log_events },
                    index
                  ) => {
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <th>{index + 1}</th>
                          <td>
                            <span className="badge border-none badge-lg bg-slate-300 text-gray-400">
                              {tx_hash.slice(0, 4) + ".." + tx_hash.slice(-4)}
                            </span>
                          </td>
                          <td>
                            <span className="badge border-none badge-lg bg-slate-400">
                              {from_address.slice(0, 4) + ".." + from_address.slice(-4)}
                            </span>
                          </td>
                          <td>{"->"}</td>
                          <td>
                            <span className="badge border-none badge-lg bg-slate-400">
                              {to_address && to_address.slice(0, 4) + ".." + to_address.slice(-4)}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge text-gray-700 border-none ${
                                value > 0 ? "bg-green-100" : "bg-red-100"
                              }`}>
                              {Number(ethers.utils.formatEther(value)).toFixed(3)}
                            </span>
                          </td>
                          <td>
                            <span className="badge text-gray-700 bg-orange-100 border-none">
                              {fees_paid && Number(ethers.utils.formatEther(fees_paid)).toFixed(5)}
                            </span>
                          </td>
                          <td>{moment(block_signed_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                          <td
                            onClick={() => {
                              setCurrentLogEventData({ log_events, tx_hash });
                              setToggleModal(!toggleModal);
                            }}>
                            <BsCalendar2Event
                              className={` text-xl ${
                                log_events.length === 0
                                  ? " text-gray-500 cursor-not-allowed"
                                  : " text-green-600 cursor-pointer"
                              }`}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  }
                )}
          </tbody>
        </table>

        {isLoadError && (
          <div className="alert alert-error shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Cant load transaction data on this network :(</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// [
//     {
//         "block_signed_at": "2022-06-16T07:47:07Z",
//         "block_height": 14972203,
//         "tx_offset": 270,
//         "log_offset": 393,
//         "tx_hash": "0x00a7d89d160162cd2e46054b4940752d758fc2d3f196a71b5bf4e4c944f47b1b",
//         "raw_log_topics": [
//             "0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724",
//             "0x00000000000000000000000034aa3f359a9d614239015126635ce7732c18fdf3"
//         ],
//         "sender_contract_decimals": 18,
//         "sender_name": "Gitcoin",
//         "sender_contract_ticker_symbol": "GTC",
//         "sender_address": "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
//         "sender_address_label": "Gitcoin (GTC)",
//         "sender_logo_url": "https://logos.covalenthq.com/tokens/0xde30da39c46104798bb5aa3fe8b9e0e1f348163f.png",
//         "raw_log_data": "0x0000000000000000000000000000000000000000000138a58b2580fb02922dda0000000000000000000000000000000000000000000138a521d3f5b05221adda",
//         "decoded": {
//             "name": "DelegateVotesChanged",
//             "signature": "DelegateVotesChanged(indexed address delegate, uint256 previousBalance, uint256 newBalance)",
//             "params": [
//                 {
//                     "name": "delegate",
//                     "type": "address",
//                     "indexed": true,
//                     "decoded": true,
//                     "value": "0x34aa3f359a9d614239015126635ce7732c18fdf3"
//                 },
//                 {
//                     "name": "previousBalance",
//                     "type": "uint256",
//                     "indexed": false,
//                     "decoded": true,
//                     "value": "1476432081989452361248218"
//                 },
//                 {
//                     "name": "newBalance",
//                     "type": "uint256",
//                     "indexed": false,
//                     "decoded": true,
//                     "value": "1476424492989452361248218"
//                 }
//             ]
//         }
//     },
//     {
//         "block_signed_at": "2022-06-16T07:47:07Z",
//         "block_height": 14972203,
//         "tx_offset": 270,
//         "log_offset": 392,
//         "tx_hash": "0x00a7d89d160162cd2e46054b4940752d758fc2d3f196a71b5bf4e4c944f47b1b",
//         "raw_log_topics": [
//             "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
//             "0x00000000000000000000000025beca2ca35db9d46ccab9e62f85f100bf0e8078",
//             "0x000000000000000000000000f4a47df012a0e03cdc6d21f97824d6e7ea3534ea"
//         ],
//         "sender_contract_decimals": 18,
//         "sender_name": "Gitcoin",
//         "sender_contract_ticker_symbol": "GTC",
//         "sender_address": "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
//         "sender_address_label": "Gitcoin (GTC)",
//         "sender_logo_url": "https://logos.covalenthq.com/tokens/0xde30da39c46104798bb5aa3fe8b9e0e1f348163f.png",
//         "raw_log_data": "0x00000000000000000000000000000000000000000000000069518b4ab0708000",
//         "decoded": {
//             "name": "Transfer",
//             "signature": "Transfer(indexed address from, indexed address to, uint256 value)",
//             "params": [
//                 {
//                     "name": "from",
//                     "type": "address",
//                     "indexed": true,
//                     "decoded": true,
//                     "value": "0x25beca2ca35db9d46ccab9e62f85f100bf0e8078"
//                 },
//                 {
//                     "name": "to",
//                     "type": "address",
//                     "indexed": true,
//                     "decoded": true,
//                     "value": "0xf4a47df012a0e03cdc6d21f97824d6e7ea3534ea"
//                 },
//                 {
//                     "name": "value",
//                     "type": "uint256",
//                     "indexed": false,
//                     "decoded": true,
//                     "value": "7589000000000000000"
//                 }
//             ]
//         }
//     }
// ]
