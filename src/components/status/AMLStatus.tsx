interface AMlStatusProps {
  readonly status: string;
}
export default function AMLStatus({ status }: AMlStatusProps) {
  const variant = {
    Unchecked: "bg-yellow-500 ",
    liccit: "bg-green-500",
    illicit: "bg-red-500 text-white",
  };
  return (
    <div className={`${variant[status]} w-max rounded-full px-4 py-1`}>
      <p>{status}</p>
    </div>
  );
}
