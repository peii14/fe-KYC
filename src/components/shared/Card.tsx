interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <>
      <div className="w-full bg-white p-10 rounded-xl shadow-lg">
        {children}
      </div>
    </>
  );
};

export default Card;
