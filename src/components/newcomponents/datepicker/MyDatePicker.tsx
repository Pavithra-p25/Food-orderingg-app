import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface MyDatePickerProps {
  name: string;
  label: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  size?:"small"|"medium";
  disabled?: boolean;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({
  name,
  label,
  disableFuture = false,
  disablePast = false,
  size="medium",
  disabled,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePicker
          label={label}
          disabled={disabled}
          value={field.value ? dayjs(field.value) : null}
          onChange={(newValue) =>
            field.onChange(newValue ? newValue.toISOString() : null)
          }
          disableFuture={disableFuture}
          disablePast={disablePast}
          slotProps={{
            textField: {
              fullWidth: true,
              size,
              error: !!fieldState.error,
              helperText: fieldState.error?.message || " ",
            },
          }}
        />
      )}
    />
  );
};

export default MyDatePicker;
