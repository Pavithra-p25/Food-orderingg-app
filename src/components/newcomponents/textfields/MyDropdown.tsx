import React from "react";
import { TextField, MenuItem } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";

type MyDropdownProps = Omit<TextFieldProps, "error" | "helperText"> & {
  options: string[];
  errorMessage?: string;
};

const MyDropdown = React.forwardRef<
  HTMLInputElement,
  MyDropdownProps
>(({ label, value, onChange, options, errorMessage, required, ...rest }, ref) => {
  return (
    <TextField
      select
      fullWidth
      label={label}
      value={value ?? ""}
      onChange={onChange}
      required={required}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      inputRef={ref}
      {...rest}
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
  );
});

MyDropdown.displayName = "MyDropdown";

export default MyDropdown;
