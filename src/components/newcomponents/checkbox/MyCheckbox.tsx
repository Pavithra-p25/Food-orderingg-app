import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Box,
} from "@mui/material";

interface MyCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  options: { label: string; value: string }[];
  onChangeOverride?: (value: string[]) => string[];
}

const MyCheckbox: React.FC<MyCheckboxProps> = ({
  name,
  label,
  disabled = false,
  required = false,
   options = [],
  onChangeOverride,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;
  const hasError = !!errorMessage;

  return (
    <FormControl error={hasError} component="fieldset">
      <FormLabel>{label}</FormLabel>

      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const value: string[] = field.value || [];

          return (
            <Box display="flex" gap={3}>
            {(options ?? []).map((option) => (

                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={value.includes(option.value)}
                      onChange={(e) => {
                        const currentValue: string[] = field.value || [];

                        const newValue = e.target.checked
                          ? [...currentValue, option.value]
                          : currentValue.filter(
                              (val: string) => val !== option.value,
                            );

                        const finalValue = onChangeOverride
                          ? onChangeOverride(newValue)
                          : newValue;

                        field.onChange(finalValue);
                      }}
                      disabled={disabled}
                      required={required}
                    />
                  }
                  label={option.label}
                />
              ))}
            </Box>
          );
        }}
      />

      {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default MyCheckbox;
