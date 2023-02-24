import Button from "./Button";
import NavPanel from "./nav_panel";
import SideBar from "./sidebar";

import { Connect } from "./connect";
import ChainName from "./chainname";

const Layout = ({ children, chainIdName }) => {
  return (
    <div className="styles_content__Vufwi">
      <SideBar className="absolute" />
      <div className="flex flex-row container justify-center items-start	max-w-screen-xl mx-auto">
        {children}
      </div>
      {/* <button type="button" className="network-button">
        Network {chainIdName}
      </button> */}
      <ChainName />
    </div>
  );
};

export default Layout;
