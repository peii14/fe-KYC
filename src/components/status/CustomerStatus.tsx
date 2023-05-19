interface CustomerStatusProps {
  readonly status: string;
}
export default function CustomerStatus({ status }: CustomerStatusProps) {
  const variant = {
    pending: "bg-yellow-500 ",
    accepted: "bg-green-500",
    rejected: "bg-red-500 text-white",
  };
  return (
    <div className={`${variant[status]} w-max rounded-full px-4 py-1`}>
      <p>{status}</p>
    </div>
  );
}
