import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className=" flex flex-1">
        <Sidebar />
        <div className="flex flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
