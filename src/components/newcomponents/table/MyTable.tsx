import React, { useState, useMemo, useEffect } from "react";
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
  Checkbox,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";

interface Column<T> {
  id: keyof T | string; // column key
  label: string | React.ReactNode; //column heading
  render?: (row: T) => React.ReactNode; //what to show in cell
  sortable?: boolean; // enable / disable sorting
  align?: "left" | "center" | "right";
  cellAlign?: (row: any) => "left" | "center" | "right";
}

interface MyTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  selectable?: boolean;
  rowId?: (row: T) => string;
  onSelectionChange?: (rows: T[]) => void;
  // bulk actions
  onBulkDelete?: (rows: T[]) => void;
  onBulkRestore?: (rows: T[]) => void;
  activeTab?: "all" | "active" | "inactive";
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (_: any, newPage: number) => void;
}
const TablePaginationActions: React.FC<TablePaginationActionsProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={(e) => onPageChange(e, 0)}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, totalPages - 1)}
        disabled={page >= totalPages - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
};

function MyTable<T>({
  columns,
  rows,
  selectable = false,
  rowId = (row: any) => row.id,
  onSelectionChange,
  onBulkDelete,
  onBulkRestore,
  activeTab = "all",
}: MyTableProps<T>) {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  //store which column is sorted
  const [order, setOrder] = useState<"asc" | "desc">("asc"); //sort order

  //  pagination states
  const [page, setPage] = useState(0); //current page
  const [rowsPerPage, setRowsPerPage] = useState(5); //rows per page

  //checkbox select
  const [selected, setSelected] = useState<string[]>([]);
  const isSelected = (id: string) => selected.includes(id);

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? rows.map(rowId) : [];
    setSelected(newSelected);
    onSelectionChange?.(rows.filter((r) => newSelected.includes(rowId(r))));
  };

  const handleRowSelect = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];

    setSelected(newSelected);
    onSelectionChange?.(rows.filter((r) => newSelected.includes(rowId(r))));
  };

  // Reset page when rows change
  useEffect(() => {
    setSelected([]);
    setPage(0);
  }, [rows]);

  const handleSort = (id: string) => {
    if (orderBy === id) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(id);
      setOrder("asc");
    }
  };

  const sortedRows = useMemo(() => {
    //prevent sorting on every render
    if (orderBy === null) return rows; //no column selected return original data

    const column = columns.find((c) => c.id === orderBy);
    if (!column || column.sortable === false) return rows;

    return [...rows].sort((a: any, b: any) => {
      const aVal = a[column.id];
      const bVal = b[column.id];

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

  const selectionColumn: Column<T> = {
    id: "__select__",
    label: (
      <Checkbox
        indeterminate={selected.length > 0 && selected.length < rows.length}
        checked={rows.length > 0 && selected.length === rows.length}
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
    ),
    sortable: false,
    align: "center",
    render: (row: T) => (
      <Checkbox
        checked={isSelected(rowId(row))}
        onChange={() => handleRowSelect(rowId(row))}
      />
    ),
  };

  const finalColumns = useMemo(() => {
    if (!selectable) return columns;
    return [selectionColumn, ...columns];
  }, [columns, selectable, selected, rows]);

  const selectedRows = useMemo(
    () => rows.filter((r) => selected.includes(rowId(r))),
    [rows, selected]
  );

  return (
    <Paper sx={{ width: "100%" }}>
     {/*  Bulk Actions Toolbar */}
{selected.length > 0 && (
  <Box
    sx={{
      p: 1,
      display: "flex",
      gap: 1,
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #e0e0e0",
    }}
  >
    <span>{selected.length} selected</span>

    {/* Delete Button */}
    {onBulkDelete && (activeTab === "all" || activeTab === "active") && (
      <IconButton
        onClick={() => {
          const rowsToDelete =
            activeTab === "active"
              ? selectedRows.filter((row: any) => row.isActive)
              : selectedRows;
          onBulkDelete(rowsToDelete);
        }}
        size="small"
        sx={{
          color: "red",
          backgroundColor: "#fdecea",
          "&:hover": { backgroundColor: "#f9d6d5" },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    )}

    {/* Restore Button */}
    {onBulkRestore && (activeTab === "all" || activeTab === "inactive") && (
      <IconButton
        onClick={() => {
          const rowsToRestore =
            activeTab === "inactive"
              ? selectedRows.filter((row: any) => !row.isActive)
              : selectedRows;
          onBulkRestore(rowsToRestore);
        }}
        size="small"
        sx={{
          color: "green",
          backgroundColor: "#e6f4ea",
          "&:hover": { backgroundColor: "#ccebd6" },
        }}
      >
        <RestoreIcon fontSize="small" />
      </IconButton>
    )}
  </Box>
)}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {finalColumns.map((col, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    width: col.id === "actions" ? 90 : undefined,
                  }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id as string)}
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
                {finalColumns.map((col, colIndex) => {
                  const alignment = col.cellAlign
                    ? col.cellAlign(row)
                    : col.align || "center";

                  return (
                    <TableCell key={colIndex} align={alignment}>
                      {col.render ? col.render(row) : (row as any)[col.id]}
                    </TableCell>
                  );
                })}
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
          ActionsComponent={TablePaginationActions}
        />
      </Box>
    </Paper>
  );
}

export default MyTable;
