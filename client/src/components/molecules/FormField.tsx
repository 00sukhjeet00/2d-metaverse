import React from "react";
import Input from "../atoms/Input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const FormField = ({
  label,
  error,
  containerClassName = "",
  ...props
}: FormFieldProps) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      <label className="block text-gray-400 text-sm font-medium ml-1">
        {label}
      </label>
      <Input {...props} />
      {error && <p className="text-red-500 text-xs ml-1">{error}</p>}
    </div>
  );
};

export default FormField;
