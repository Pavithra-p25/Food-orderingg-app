import React, { useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Box,
} from "@mui/material";

interface Column<T> {
  label: string; //column heading
  render: (row: T) => React.ReactNode; //what to show in cell
  sortValue?: (row: T) => string | number; // enable sorting
}

interface MyTableProps<T> {
  columns: Column<T>[]; //table columns
  rows: T[]; //table data
}

function MyTable<T>({ columns, rows }: MyTableProps<T>) {
  const [orderBy, setOrderBy] = useState<number | null>(null); //store which column is sorted
  const [order, setOrder] = useState<"asc" | "desc">("asc"); //sort order

  //  pagination states
  const [page, setPage] = useState(0); //current page
  const [rowsPerPage, setRowsPerPage] = useState(5); //rows per page

  const handleSort = (index: number) => {
    //run when user clicks column header
    if (orderBy === index) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(index);
      setOrder("asc");
    }
  };

  const sortedRows = useMemo(() => {
    //prevent sorting on every render
    if (orderBy === null) return rows; //no column selected return original data

    const column = columns[orderBy];
    if (!column.sortValue) return rows;

    return [...rows].sort((a, b) => {
      const aVal = column.sortValue!(a);
      const bVal = column.sortValue!(b);

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, orderBy, order, columns]);

  //pagination logic
  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index} sx={{ fontWeight: "bold" }}>
                  {col.sortValue ? ( //if sortValue exists, make column sortable
                    <TableSortLabel
                      active={orderBy === index}
                      direction={orderBy === index ? order : "asc"}
                      onClick={() => handleSort(index)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>{col.render(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/*  Pagination footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          borderTop: "1px solid #e0e0e0",
          px: 2,
        }}
      >
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              alignItems: "center",
              minHeight: "52px",
            },
            "& .MuiTablePagination-selectLabel": {
              marginBottom: 0,
              display: "flex",
              alignItems: "center",
            },
            "& .MuiTablePagination-displayedRows": {
              marginBottom: 0,
              display: "flex",
              alignItems: "center",
            },
            "& .MuiTablePagination-actions": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Box>
    </Paper>
  );
}

export default MyTable;
