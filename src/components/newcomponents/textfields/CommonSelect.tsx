import {
  TextField,
  MenuItem,
} from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import React from "react";

type CommonSelectProps = Omit<TextFieldProps, "select"> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: string[];
};

const CommonSelect: React.FC<CommonSelectProps> = ({
  value,
  onChange,
  options,
  ...props
}) => {
  return (
    <TextField
      {...props}
      select
      value={value}
      onChange={onChange}
      fullWidth
      size="small"
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option || "All"}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CommonSelect;
