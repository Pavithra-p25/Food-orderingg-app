import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";

type MyInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  errorMessage?: string;
  onClick?: () => void;
} & Partial<TextFieldProps>;

const MyInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  errorMessage,
  ...rest
}: MyInputProps<T>) => {
  const { control } = useFormContext<T>(); 

  return (
   <Controller
  name={name}
  control={control}
  render={({ field }) => {
    const safeValue =
      type === "number"
        ? Number.isNaN(field.value)
          ? ""
          : field.value ?? ""
        : field.value ?? "";

    return (
      <TextField
        {...field}
        value={safeValue}
        fullWidth
        label={label}
        placeholder={placeholder}
        type={type}
        required={required}
        error={Boolean(errorMessage)}
        helperText={errorMessage}
        inputRef={field.ref}
        {...rest}
      />
    );
  }}
/>

  );
};

export default MyInput;
