import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { TextField , type TextFieldProps} from "@mui/material";

type MyInputProps<T extends FieldValues> = {
  name: Path<T>;
  control?: Control<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value?: string;
  errorMessage?: string;
  onClick?: () => void;
}& Partial<TextFieldProps>;

const MyInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  required = false,
  errorMessage,
  ...rest 
}: MyInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          placeholder={placeholder}
          type={type}
          required={required}
          error={Boolean(errorMessage)}
          helperText={errorMessage || " "}
          {...rest}
        />
      )}
    />
  );
};

export default MyInput;
