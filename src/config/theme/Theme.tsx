import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          textAlign: "center", 
          fontWeight: "bold", 
          backgroundColor: "#9e9e9e", 
          color: "#ffffff",          
        },
      },
    },
  },
});

export default Theme;
