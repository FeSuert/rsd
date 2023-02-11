import Button from "./Button";
import NavPanel from "./nav_panel";
import SideBar from "./sidebar";

const Layout = ({ children }) => {
  return (
    <div className="styles_content__Vufwi">
      <SideBar className="absolute" />
      <div className="flex flex-row container justify-center items-start	max-w-screen-xl mx-auto">
        {children}
      </div>
      <button type="button" className="network-button">
        Network
      </button>
    </div>
  );
};

export default Layout;
