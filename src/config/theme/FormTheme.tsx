import { createTheme } from "@mui/material/styles";

const FormTheme = createTheme({
  components: { //to override default MUI styles
    MuiFormHelperText: { //text below input fields
      styleOverrides: {
        root: {   //form helper text
          marginLeft: 0,   //removes left space
          marginRight: 0,
        },
      },
    },
  },
});

export default FormTheme;
