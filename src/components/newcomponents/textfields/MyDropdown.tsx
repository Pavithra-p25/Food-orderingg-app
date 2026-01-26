import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";

type MyDropdownProps = {
  name: string;
  control: Control<any>;
  label: string;
  options: string[];
  required?: boolean;
  size?: "small" | "medium";
};

const MyDropdown: React.FC<MyDropdownProps> = ({
  name,
  control,
  label,
  options,
  required = false,
  size = "medium",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
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
