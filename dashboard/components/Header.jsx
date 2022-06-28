import ThemeSwitch from "./ThemeSwitch";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 ">
        <div className="flex-1">{/* <a className="btn btn-ghost normal-case text-xl">daisyUI</a> */}</div>

        {/* <ThemeSwitch /> */}
        <div className="navbar-end">
          <div className="mx-5">
            <ConnectButton
              // chainStatus={"name"}
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
