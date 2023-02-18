import Link from "next/link";
import {
  AiTwotoneHome,
  AiFillCheckSquare,
  AiTwotoneWarning,
} from "react-icons/ai";
import { FaHistory } from "react-icons/fa";

const Sidebar = () => {
  return (
    <>
      <nav className="w-1/6 h-screen">
        <ul className="py-20">
          <li>
            <Link
              href={"/"}
              className={`flex items-center rounded-r-full px-4 py-4 space-x-3 hover:bg-dark hover:text-light duration-200`}
            >
              <AiTwotoneHome />
              <p>Home</p>
            </Link>
          </li>
          <li>
            <Link
              href={"/"}
              className={`flex items-center rounded-r-full px-4 py-4 space-x-3 hover:bg-dark hover:text-light duration-200`}
            >
              <AiFillCheckSquare />
              <p>Customer Status</p>
            </Link>
          </li>
          <li>
            <Link
              href={"/"}
              className={`flex items-center rounded-r-full px-4 py-4 space-x-3 hover:bg-dark hover:text-light duration-200`}
            >
              <FaHistory />
              <p>Transaction History</p>
            </Link>
          </li>
          <li>
            <Link
              href={"/"}
              className={`flex items-center rounded-r-full px-4 py-4 space-x-3 hover:bg-dark hover:text-light duration-200`}
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
