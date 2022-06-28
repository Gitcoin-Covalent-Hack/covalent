import moment from "moment";
import Image from "next/image";

import React from "react";

const ChainDetails = ({ chainItems }) => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="grid gap-8 row-gap-5 md:grid-cols-2">
        {chainItems.map((item) => (
          <React.Fragment key={item.name}>
            <div className="relative p-px overflow-hidden transition duration-300 transform border rounded shadow-sm hover:scale-105 group hover:shadow-xl">
              <div className="absolute bottom-0 left-0 w-full h-1 duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
              <div className="absolute bottom-0 left-0 w-1 h-full duration-300 origin-bottom transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
              <div className="absolute top-0 left-0 w-full h-1 duration-300 origin-right transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
              <div className="absolute bottom-0 right-0 w-1 h-full duration-300 origin-top transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
              <div className="relative flex flex-col h-full p-5 bg--white rounded-sm lg:items-center lg:flex-row">
                <div className="mb-6 mr-6 lg:mb-0">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-base-300 lg:w-32 lg:h-32">
                    <Image src={item.logo_url} height={250} width={250} alt={item.name} />
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h6 className="mb-2 font-semibold leading-5 first-letter:capitalize">
                      {item.name.split("-").join(" ")}
                    </h6>
                    <div className="mb-2 text-sm ">
                      <div className=" flex flex-col justify-around my-2 items-start">
                        <span className="my-1 ">
                          Chain Id : <span className="badge badge-sm badge-ghost mx-2">{item.chain_id}</span>
                        </span>
                        <span className="my-1">
                          Test Net :{" "}
                          <span className="badge badge-sm badge-ghost mx-2">{item.is_testnet.toString()}</span>
                        </span>
                        <span className="my-1">
                          Block Height :{" "}
                          <span className="badge badge-sm badge-ghost mx-2">{item.synced_block_height}</span>
                        </span>
                        <span className="my-1">
                          Signed At :
                          <span className="badge badge-sm badge-ghost mx-2 text-xs" suppressHydrationWarning>
                            {moment(item.synced_blocked_signed_at).format("YYYY-MM-DD HH:mm:ss")}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default ChainDetails;
