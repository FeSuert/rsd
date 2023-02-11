import Button from "./Button";
import ChainName from "./chainName";
import NavPanel from "./nav_panel";
import SideBar from "./sidebar";

const Layout = ({ children }) => {
  return (
    <div>
      <SideBar className="absolute" />
      <div className="flex flex-row container justify-center items-start	max-w-screen-xl mx-auto">
        {children}
      </div>
      <ChainName />
    </div>
  );
};

export default Layout;
