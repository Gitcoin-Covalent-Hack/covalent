import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import ThemeSwitch from "./ThemeSwitch";
import { routes } from "./SideBar";
import SearchAddress from "./SearchAddress";

const Header = () => {
  const { pathname } = useRouter();
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 ">
        {/* mobile menu  */}
        <div className="navbar-start lg:hidden">
          <div className="dropdown">
            <label tabIndex="0" className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </label>
            <ul
              tabIndex="0"
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <SearchAddress />
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
            </ul>
          </div>
        </div>
        <div className="flex-1">{/* <a className="btn btn-ghost normal-case text-xl">daisyUI</a> */}</div>

        {/* <ThemeSwitch /> */}
        <div className="navbar-end">
          <div className="mx-5">
            <ConnectButton
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>
          <ThemeSwitch />
        </div>
      </div>
    </>
  );
};

export default Header;
