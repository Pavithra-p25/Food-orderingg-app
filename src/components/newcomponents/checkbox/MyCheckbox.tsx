import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";

interface MyCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
}

const MyCheckbox: React.FC<MyCheckboxProps> = ({
  name,
  label,
  disabled = false,
  required = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;
  const hasError = !!errorMessage;

  return (
    <FormControl error={hasError}>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={disabled}
                required={required}
              />
            }
            label={label}
          />
        )}
      />

      {hasError && (
        <FormHelperText>{errorMessage}</FormHelperText>
      )}
    </FormControl>
  );
};

export default MyCheckbox;
