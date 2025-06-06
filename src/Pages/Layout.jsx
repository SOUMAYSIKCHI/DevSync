import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen   bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};


export default Layout;