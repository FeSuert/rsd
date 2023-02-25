import SideBar from "./sidebar";
import ChainName from "./chainname";

const Layout = ({ children }) => {
  return (
    <div className="styles_content__Vufwi">
      <SideBar className="absolute" />
      <div className="flex flex-row container justify-center items-start	max-w-screen-xl mx-auto">
        {children}
      </div>
      <ChainName />
    </div>
  );
};

export default Layout;
