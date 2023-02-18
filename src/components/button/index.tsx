const Button = ({
  children,
  type,
  onClick,
  className,
}: {
  children: React.ReactNode;
  type: number;
  onClick?: any;
  className?: string;
}) => {
  return (
    <>
      <button
        onClick={onClick}
        className={`w-full border-2 border-dark duration-200 ${className} ${
          type === 1
            ? "bg-dark py-3 text-light hover:text-dark hover:shadow-theme hover:bg-light"
            : "bg-light py-3 text-dark hover:shadow-theme "
        }  rounded-lg flex flex-row justify-center items-center space-x-3`}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
