import React from "react";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";

type MyTextareaProps = {
  name: string;
  control: Control<any>;         // RHF control
  label?: string;
  placeholder?: string;
  rows?: number;
  errors?: FieldErrors<any>;     // RHF errors
  required?: boolean;
};

const MyTextarea: React.FC<MyTextareaProps> = ({
  name,
  control,
  label,
  placeholder,
  rows = 3,
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
          label={label}
          placeholder={placeholder}
          fullWidth
          multiline
          rows={rows}
          error={Boolean(errors?.[name]?.message)}
          helperText={errors?.[name]?.message as string}
          required={required}
        />
      )}
    />
  );
};

export default MyTextarea;
