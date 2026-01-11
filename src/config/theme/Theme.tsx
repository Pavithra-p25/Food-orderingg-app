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

    // Center sort labels
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          width: "100%",
          display: "flex",
          justifyContent: "center",
        },
      },
    },

    //Pagination consistency
    MuiTablePagination: {
      styleOverrides: {
        toolbar: {
          minHeight: "52px",
          alignItems: "center",
        },
        selectLabel: {
          marginBottom: 0,
          display: "flex",
          alignItems: "center",
        },
        displayedRows: {
          marginBottom: 0,
          display: "flex",
          alignItems: "center",
        },
        actions: {
          display: "flex",
          alignItems: "center",
        },
      },
    },

    // Checkbox padding (table selection)
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },

    // Icon buttons (bulk delete / restore)
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: "none",
        },
      },
    },

    // Paper default for tables
    MuiPaper: {
      styleOverrides: {
        root: {
          overflow: "hidden",
        },
      },
    },
  },
});

export default Theme;
