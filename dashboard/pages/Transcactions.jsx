import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useBalance, useEnsAddress, useEnsName, useNetwork } from "wagmi";
import { BsCalendar2Event } from "react-icons/bs";

import { COVALENT_KEY } from "../constants";
import { useStore } from "../store/useStore";
import API from "../utils/API";
import EventLogModal from "../components/EventLogModal";

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
      setIsLoading(true);
      // console.log("load tx data for  ", address, chainId);
      let response = await API.get(
        // `https://api.covalenthq.com/v1/${chainId}/address/${address}/transactions_v2/?key=${COVALENT_KEY}&page-size=${pageSize}&page-number=${pageNumber}&no-logs=false`
        `/${chainId}/address/${address}/transactions_v2/?key=${COVALENT_KEY}&page-size=${pageSize}&page-number=${pageNumber}&no-logs=false`
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
    // setIsLoading(true);
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
      {/* event log modal view */}
      {toggleModal && (
        <EventLogModal isOpen={toggleModal} eventLogData={currentLogEventData} setToggleModal={setToggleModal} />
      )}

      {/* basic meta info  */}
      <div className="w-full my-2 flex justify-center ">
        <div className="stats stats-vertical lg:stats-horizontal shadow">
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

      {/* pagination */}
      <div className="btn-group m-5  ml-auto  flex justify-center lg:justify-end">
        <button className="btn btn-ghost btn-outline" onClick={onPreviousPage}>
          «
        </button>
        <button className="btn btn-ghost">Page {pageNumber}</button>
        <button className="btn btn-ghost btn-outline" onClick={onNextPage} disabled={dataCompleted}>
          »
        </button>
      </div>

      <div className="overflow-x-auto w-full   lg:flex lg:justify-center lg:items-end lg:flex-col">
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
              txData.map(
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
                            className={`badge text-gray-700 border-none ${value > 0 ? "bg-green-100" : "bg-red-100"}`}>
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

        {/* cant fetch on network alert */}
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
              <span>Cant load transaction data on this network !!</span>
            </div>
          </div>
        )}

        {/* no tx data alert */}
        {txData.length === 0 && (
          <div className="alert alert-warning shadow-lg">
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
              <span>No transaction data available !!</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
