import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

interface MyTimePickerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
}

const MyTimePicker = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
}: MyTimePickerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TimePicker
          label={label}
          value={field.value ? dayjs(field.value) : null}
          onChange={(newValue) =>
            field.onChange(newValue ? newValue.toISOString() : null)
          }
          slotProps={{
            textField: {
              fullWidth: true,
              required,
              error: !!fieldState.error,
              helperText: fieldState.error?.message,
            },
          }}
        />
      )}
    />
  );
};

export default MyTimePicker;
