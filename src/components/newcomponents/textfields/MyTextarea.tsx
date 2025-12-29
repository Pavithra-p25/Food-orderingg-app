import React from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";

type MyTextareaProps = Omit<TextFieldProps, "error" | "helperText"> & {
  errorMessage?: string;
};

const MyTextarea = React.forwardRef<
  HTMLTextAreaElement,
  MyTextareaProps
>(({ errorMessage, rows = 3, ...rest }, ref) => {
  return (
    <TextField
      {...rest}
      fullWidth
      multiline
      rows={rows}
      error={Boolean(errorMessage)}   // boolean for MUI
      helperText={errorMessage}       // string message
      inputRef={ref}
    />
  );
});

MyTextarea.displayName = "MyTextarea";

export default MyTextarea;
