import { Dispatch } from "react";

interface InputProps {
  readonly label: string;
  entity: string;
  className?: string;
  register: any;
  errors: any;
  patern?: any;
  placeholder?: any;
}

const Input = ({
  label,
  entity,
  register,
  errors,
  patern,
  placeholder,
  className,
}: InputProps) => {
  return (
    <>
      <div className={className}>
        <label htmlFor={entity}>{label}</label>
        <input
          placeholder={placeholder}
          type={entity.toLowerCase()}
          {...register(entity, {
            required: `Please enter ${entity}`,
            pattern: patern,
          })}
          className={`w-full my-2 px-3 py-2 border-2 border-sec rounded-lg shadow-sm text-dark  ${
            errors.entity ? "ring-1 ring-red-600" : ""
          }`}
          id={entity}
          autoFocus
        />
      </div>
    </>
  );
};

export default Input;
