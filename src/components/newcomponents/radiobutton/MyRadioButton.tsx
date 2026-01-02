import React from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface MyRadioButtonProps {
  name: string;
  label: string;
  value: string | number;
  disabled?: boolean;
}

const MyRadioButton: React.FC<MyRadioButtonProps> = ({
  name,
  label,
  value,
  disabled = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <FormControl error={!!error} disabled={disabled}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            label={label}
            control={
              <Radio
                checked={field.value === value}
                onChange={() => field.onChange(value)}
              />
            }
          />
        )}
      />

      {error && (
        <FormHelperText>
          {String((error as any)?.message)}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default MyRadioButton;
