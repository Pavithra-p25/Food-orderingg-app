import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: {
              default: "#f9f9f9",
              paper: "#ffffff",
            },
            text: {
              primary: "#000000",
            },
          }
        : {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
            text: {
              primary: "#ffffff",
            },
          }),
    },

    components: {
      MuiFormHelperText: {
        styleOverrides: {
          root: { marginLeft: 0, marginRight: 0 },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          head: {
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: mode === "dark" ? "#424242" : "#9e9e9e",
            color: "#ffffff",
          },
        },
      },

      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
          },
        },
      },

      MuiTablePagination: {
        styleOverrides: {
          toolbar: { minHeight: "52px", alignItems: "center" },
          selectLabel: { marginBottom: 0 },
          displayedRows: { marginBottom: 0 },
        },
      },

      MuiCheckbox: {
        styleOverrides: { root: { padding: 8 } },
      },

      MuiIconButton: {
        styleOverrides: { root: { border: "none" } },
      },

      MuiPaper: {
        styleOverrides: { root: { overflow: "hidden" } },
      },
    },
  });
