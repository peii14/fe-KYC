import { useRouter } from "next/router";

const Navbar = () => {
  const route = useRouter();
  return (
    <>
      <header
        className={`w-screen py-2 px-5 z-50  h-14 fixed top-0 items-center ${
          route.route === "/" ? "" : "bg-light"
        }`}
      >
        <div className="">
          <h3 className="font-bold m-auto">nameless</h3>
        </div>
      </header>
    </>
  );
};

export default Navbar;
