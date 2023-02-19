import { useWeb3 } from "@3rdweb/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AiTwotoneHome,
  AiFillCheckSquare,
  AiTwotoneWarning,
} from "react-icons/ai";
import { FaHistory } from "react-icons/fa";

const Sidebar = () => {
  const route = useRouter();
  const { address } = useWeb3();
  return (
    <>
      <nav
        className={`h-screen max-w-max ${
          route.route === "/" ? "hidden" : "block"
        }`}
      >
        <ul className="py-20 flex flex-col space-y-3">
          <li>
            <Link
              href={"/" + address + "/"}
              className={`${
                route.asPath.split("/").length - 1 === 1
                  ? " bg-dark text-light"
                  : ""
              } flex items-center rounded-r-full px-4 py-4 space-x-3 hover:bg-dark hover:text-light duration-200`}
            >
              <AiTwotoneHome />
              <p>New customer</p>
            </Link>
          </li>
          <li>
            <Link
              href={"/" + address + "/customer-status"}
              className={`${
                route.asPath.includes("/customer-status")
                  ? " bg-dark text-light"
                  : ""
              } flex items-center rounded-r-full px-4 py-4 space-x-3 hover:bg-dark hover:text-light duration-200`}
            >
              <AiFillCheckSquare />
              <p>Customer Status</p>
            </Link>
          </li>
          <li>
            <Link
              href={"/" + address + "/transaction-history"}
              className={`${
                route.asPath.includes("/transaction-history")
                  ? " bg-dark text-light"
                  : ""
              } flex items-center rounded-r-full px-4 pr-6 py-4 space-x-3 hover:bg-dark hover:text-light duration-200`}
            >
              <FaHistory />
              <p>Transaction History</p>
            </Link>
          </li>
          <li>
            <Link
              href={"/" + address + "/update-data"}
              className={`${
                route.asPath.includes("/update-data")
                  ? " bg-dark text-light"
                  : ""
              } flex items-center rounded-r-full px-4 py-4 space-x-3 hover:bg-dark hover:text-light duration-200`}
            >
              <AiTwotoneWarning />
              <p>Update Data</p>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
export default Sidebar;
