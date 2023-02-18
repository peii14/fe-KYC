import Footer from "./Footer";
import Navbar from "./Navbar";
import { Poppins } from "@next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className={poppins.className}>{children}</main>
      <Footer />
    </>
  );
};
export default Layout;
