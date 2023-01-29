import Button from "./Button";
import NavPanel from "./nav_panel";
import SideBar from "./sidebar";

const Layout = () => {
  return (
    <>
      <div className="flex flex-row container justify-between items-start	max-w-screen-xl mx-auto">
        <SideBar className="w-1/4" />
        <Button> Network </Button>
      </div>
    </>
  );
};

export default Layout;
