import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { COVALENT_KEY } from "../constants";
import { useStore } from "../store/useStore";
import API from "../utils/API";

export default function TranscactionsPage() {
  //TODO:make it dynamic from page
  const DEFAULT_PAGE_SIZE = 10;

  const [txData, setTxData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataCompleted, setDataCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadError, setIsLoadError] = useState(false);
  const [state, dispatch] = useStore();

  const { activeChain } = useNetwork();

  const fetchTxData = async (address, chainId, pageNumber, pageSize) => {
    try {
      console.log("load tx data for  ", address, chainId);
      let response = await API.get(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/transactions_v2/?key=${COVALENT_KEY}&page-size=${pageSize}&page-number=${pageNumber}&no-logs=true`
      );

      let txItems = response.data.data.items;
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

  // fetch tx data page wise
  useEffect(() => {
    setIsLoadError(false);
    setIsLoading(true);
    if (state.address && activeChain.id > 0) {
      void fetchTxData(state.address, activeChain.id, pageNumber, DEFAULT_PAGE_SIZE);
    }

    if (state.searchedAddress && activeChain.id > 0) {
      // check searchedAddress is a valid address
      if (state.searchedAddress.length == 42 || state.searchedAddress.includes(".eth")) {
        void fetchTxData(state.searchedAddress, activeChain.id, pageNumber, DEFAULT_PAGE_SIZE);
      }
    }
  }, [pageNumber, state.address, state.searchedAddress, activeChain.id]);

  return (
    <>
      {/* basic info  */}
      <div className="w-auto my-2">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">Eth price</div>
            <div className="stat-value">$1000</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">Balance</div>
            <div className="stat-value">100 Eth</div>
            <div className="stat-desc">$1000</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">User</div>
            <div className="stat-value">0x81..b8c1</div>
            <div className="stat-desc">naim.eth</div>
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
              <th>Tx Hash</th>
              <th>From</th>
              <th></th>
              <th>To</th>
              <th>Value</th>
              <th>Fee paid</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {txData.length > 0 &&
              txData
                // .filter((data) => data.value > 0)
                .map(({ tx_hash, from_address, to_address, value, successful, fees_paid, block_signed_at }, index) => {
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
                      </tr>
                    </React.Fragment>
                  );
                })}
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
