import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface MyRadioButtonProps {
  name: string; //field name
  label: string; // Group label
  options: { label: string; value: string | number }[]; //array of options
  disabled?: boolean;
}

const MyRadioButton: React.FC<MyRadioButtonProps> = ({
  name,
  label,
  options,
  disabled = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]; // get error for this field

  return (
    <FormControl component="fieldset" error={false} disabled={disabled}>
      <FormLabel component="legend" sx={{ fontWeight: 500, marginBottom: 1 }}>
        {label}
      </FormLabel>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup {...field} row>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        )}
      />

      {/* Display error message if exists */}
      {error && <FormHelperText error>{String((error as any)?.message)}</FormHelperText>} 
    </FormControl>
  );
};

export default MyRadioButton;
