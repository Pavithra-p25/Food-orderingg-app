import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface Column<T> {
  label: string;
  render: (row: T) => React.ReactNode;
}

interface MyTableProps<T> {
  columns: Column<T>[];
  rows: T[];
}

function MyTable<T>({ columns, rows }: MyTableProps<T>) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "grey.600", 
            }}
          >
            {columns.map((col, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: "bold",
                  color: "white", 
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MyTable;
