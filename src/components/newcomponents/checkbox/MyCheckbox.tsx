import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox, FormControlLabel, FormHelperText, FormGroup } from "@mui/material";

interface MyCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
}

const MyCheckbox: React.FC<MyCheckboxProps> = ({ name, label, disabled = false }) => {
  const {
    control,
    trigger,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  // Trigger validation once when the component mounts
  useEffect(() => {
    trigger(name);
  }, [trigger, name]);

  return (
    <FormGroup>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={!!field.value}
                disabled={disabled}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  trigger(name); // validate on every change
                }}
              />
            }
            label={label}
          />
        )}
      />
      {error && <FormHelperText error>{String((error as any)?.message)}</FormHelperText>}
    </FormGroup>
  );
};

export default MyCheckbox;
