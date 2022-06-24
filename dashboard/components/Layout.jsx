import SideBar from "./SideBar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <div className="">
        <div className="flex ">
          <SideBar />
          <div className="flex flex-col w-screen">
            <Header />
            <div className="w-auto self--center m-5">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;
