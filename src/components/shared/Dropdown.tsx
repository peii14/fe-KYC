import Button from "../button";
import { useState } from "react";
interface OptoionsProps {
  optionName: string;
  onClick: any;
}

interface DropdownProps {
  options: OptoionsProps[];
  children: React.ReactNode;
}
const Dropdown = ({ options, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)} type={3}>
        {children}
      </Button>
      <div
        className={`${
          isOpen
            ? "block absolute shadow-lg border border-primary-200 right-3 -bottom-9 z-50 overflow-hidden "
            : "hidden"
        }  bg-white w-2/3 absolute rounded-xl`}
      >
        {isOpen &&
          options.map((option, idx) => (
            <button
              onClick={option.onClick}
              className="w-full hover:bg-primary-200 text-left px-3 py-1 z-50"
              key={idx}
            >
              {option.optionName}
            </button>
          ))}
      </div>
    </>
  );
};
export default Dropdown;
