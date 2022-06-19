import SideBar from "./SideBar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <div className="">
        {/* <div className="flex flex-row-reverse  ">
          <div className=" w-[79%] ml-auto">
            <Header />
          </div>
          <div className="w-[20%]">
            <SideBar />
          </div>
        </div> */}

        <div className="flex ">
          <SideBar />
          <div className="flex flex-col w-screen">
            <Header />
            <div className="w-auto">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;
