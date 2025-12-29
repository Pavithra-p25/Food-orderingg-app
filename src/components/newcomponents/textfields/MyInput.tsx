import React from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";

type MyInputProps = TextFieldProps & {
  errorMessage?: string; // renamed to avoid collision with MUI's 'error' boolean
};

const MyInput = React.forwardRef<HTMLInputElement, MyInputProps>(
  ({ errorMessage, ...rest }, ref) => {
    return (
      <TextField
        {...rest}
        fullWidth
        error={Boolean(errorMessage)} // boolean for MUI
        helperText={errorMessage} // string for error message
        inputRef={ref}
      />
    );
  }
);

export default MyInput;
