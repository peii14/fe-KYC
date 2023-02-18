import Footer from "./Footer";
import Navbar from "./Navbar";
import { Poppins } from "@next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const Layout = ({ children }: { children: React.ReactNode }) => {
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
      <main className={poppins.className}>{children}</main>
      <Footer />
    </>
  );
};
export default Layout;
