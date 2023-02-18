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
          isAuth ? "flex flex-row space-x-5 bg-gray-200 " : "first:hidden"
        }`}
      >
        <Sidebar />
        <div className={poppins.className}>{children}</div>
      </div>
      <Footer />
    </>
  );
};
export default Layout;
