import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

import { AiOutlineAreaChart, AiOutlineHome, AiOutlinePieChart } from "react-icons/ai";
import { BiLineChart, BiGasPump } from "react-icons/bi";
import { useEnsAvatar } from "wagmi";

import { useStore } from "../store/useStore";
import SearchAddress from "./SearchAddress";

export const routes = [
  { tabName: "Home", pageName: "/", icon: <AiOutlineHome /> },
  { tabName: "Charts", pageName: "/Charts", icon: <AiOutlineAreaChart /> },
  { tabName: "Gas Guzzler", pageName: "/GasCalculator", icon: <BiGasPump /> },
  { tabName: "Analysis", pageName: "/Analysis", icon: <AiOutlinePieChart /> },
  { tabName: "Transcactions", pageName: "/Transcactions", icon: <BiLineChart /> },
];

const SideBar = () => {
  const { pathname } = useRouter();
  const [state, dispatch] = useStore();

  // handle address input
  const handleChange = (e) => {
    dispatch({ payload: { searchedAddress: e.target.value } });
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 1000);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  return (
    <>
      {/* desktop sidebar */}
      <div className="h-screen sticky top-0 px-4 py-8  border-r dark:bg-gray-800 dark:border-gray-600 hidden lg:block">
        <h2 className="text-3xl font-semibold text-primary">Covalent</h2>

        <SearchAddress />

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            {routes.map((tab) => (
              <React.Fragment key={tab.pageName}>
                <Link href={tab.pageName}>
                  <a
                    className={`flex items-center px-4 mt-2 py-2   rounded-md 
                                ${pathname === tab.pageName ? "bg-primary text-primary-content" : ""}
		                          `}
                    href="#">
                    <div className="flex w-full">
                      <span className="mx-1">{tab.icon}</span>
                      <span className=" font-medium">{tab.tabName}</span>
                    </div>
                  </a>
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideBar;
