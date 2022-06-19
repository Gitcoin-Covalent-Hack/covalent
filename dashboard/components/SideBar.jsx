import Link from "next/link";
import { useRouter } from "next/router";

import { AiOutlineAreaChart, AiOutlineHome, AiOutlinePieChart } from "react-icons/ai";
import { BiLineChart } from "react-icons/bi";

const routes = [
  { tabName: "Home", pageName: "/", icon: <AiOutlineHome /> },
  { tabName: "Charts", pageName: "/Charts", icon: <AiOutlineAreaChart /> },
  { tabName: "Analysis", pageName: "/Analysis", icon: <AiOutlinePieChart /> },
  { tabName: "Transcactions", pageName: "/Transcactions", icon: <BiLineChart /> },
];

const SideBar = () => {
  const { pathname } = useRouter();
  return (
    <>
      <div className="flex flex-col w-64 h-screen px-4 py-8  border-r dark:bg-gray-800 dark:border-gray-600 ">
        <h2 className="text-3xl font-semibold text-primary">Covalent</h2>

        <div className="relative mt-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"></path>
            </svg>
          </span>

          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            placeholder="Enter Address"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            {routes.map((tab) => (
              <>
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
              </>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideBar;
