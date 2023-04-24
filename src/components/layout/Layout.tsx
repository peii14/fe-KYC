import Footer from "./Footer";
import Navbar from "./Navbar";
import { Poppins } from "@next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const Layout = ({
  children,
  isAuth = false,
}: {
  isAuth?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <>
      <ToastContainer
        rtl={false}
        autoClose={3000}
        position="bottom-center"
        limit={5}
        pauseOnFocusLoss
      />
      <Navbar />
      <div
        className={`${
          isAuth
            ? "grid grid-cols-6 space-x-3 bg-gray-200 w-screen "
            : "first:hidden"
        }`}
      >
        <Sidebar />
        <div
          className={`${poppins.className} col-span-5 ${isAuth ? "pr-16" : ""}`}
        >
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Layout;
