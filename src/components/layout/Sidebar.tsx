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
  return (
    <>
      <nav className={`h-screen ${route.route === "/" ? "hidden" : "block"}`}>
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
