import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";

type MyDropdownProps = {
  name: string;
  control: Control<any>;
  label: string;
  options: string[];
  errors?: FieldErrors<any>;
  required?: boolean;
};

const MyDropdown: React.FC<MyDropdownProps> = ({
  name,
  control,
  label,
  options,
  errors,
  required = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          select
          fullWidth
          label={label}
          required={required}
          error={Boolean(errors?.[name]?.message)}
          helperText={errors?.[name]?.message as string}
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
