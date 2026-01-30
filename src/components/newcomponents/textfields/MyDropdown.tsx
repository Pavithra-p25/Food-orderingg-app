import { TextField, MenuItem } from "@mui/material";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";

type MyDropdownProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: string[];
  required?: boolean;
  size?: "small" | "medium";
   fullWidth?: boolean; 
};

const MyDropdown = <T extends FieldValues>({
  name,
  label,
  options,
  required = false,
  size = "medium",
  fullWidth = true,
}: MyDropdownProps<T>) => {
  const { control } = useFormContext<T>(); 

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
           fullWidth={fullWidth} 
          label={label}
          required={required}
          size={size}
          error={!!error}
          helperText={error?.message || ""}
        >
          <MenuItem value="">
            Select {label}
          </MenuItem>

          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default MyDropdown;
