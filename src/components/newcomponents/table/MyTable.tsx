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
  Switch,
  FormControlLabel,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import Collapse from "@mui/material/Collapse";

interface Column<T> {
  id: keyof T | string; // column key
  label: string | React.ReactNode; //column heading
  render?: (row: T) => React.ReactNode; //what to show in cell
  sortable?: boolean; // enable / disable sorting
  align?: "left" | "center" | "right";
  cellAlign?: (row: any) => "left" | "center" | "right";
}

type ColumnGroup = {
  label: string;
  columns: string[]; // column ids
};

interface MyTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  selectable?: boolean;
  columnGroups?: ColumnGroup[];
  rowId?: (row: T) => string;
  onSelectionChange?: (rows: T[]) => void;
  // bulk actions
  onBulkDelete?: (rows: T[]) => void;
  onBulkRestore?: (rows: T[]) => void;
  expandedContent?: (row: T) => React.ReactNode;
  enableExpand?: boolean;
  pagination?: boolean;
  enableGroupScroll?: boolean;
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
  //Calculates total pages ,Buttons disabled when at start/end

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
  columnGroups,
  rowId = (row: any) => row.id,
  onSelectionChange,
  onBulkDelete,
  onBulkRestore,
  expandedContent,
  enableExpand,
  pagination = true,
  enableGroupScroll = false,
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

  //common expand icon
  const [expandAll, setExpandAll] = useState(false);

  //handle/deselect all rows
  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? rows.map(rowId) : [];
    setSelected(newSelected);
    onSelectionChange?.(rows.filter((r) => newSelected.includes(rowId(r))));
  };

  //single row selection
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
  const visibleRows = useMemo(() => {
    if (!pagination) return sortedRows;

    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage, pagination]);

  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  useEffect(() => {
    if (!enableExpand) return;

    const allRowsState: Record<string, boolean> = {};
    rows.forEach((row) => {
      allRowsState[rowId(row)] = expandAll;
    });

    setOpenRows(allRowsState);
  }, [expandAll, rows, enableExpand]);

  const expandColumn: Column<T> = {
    id: "__expand__",
    label: (
      <IconButton size="small" onClick={() => setExpandAll((prev) => !prev)}>
        {expandAll ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    ),
    sortable: false,
    align: "center",
    render: (row: T) => {
      const id = rowId(row);
      const open = openRows[id];

      return (
        <IconButton size="small" onClick={() => toggleRow(id)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      );
    },
  };

  //adds checkbox if selectable is true
  const selectionColumn: Column<T> = {
    id: "__select__",
    label: (
      <Checkbox
        indeterminate={selected.length > 0 && selected.length < rows.length} //Shows a - instead of a check when only some rows are selected
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
    let cols = columns;

    if (selectable) cols = [selectionColumn, ...cols];

    if (enableExpand) {
      cols = [expandColumn, ...cols]; //only when enabled
    }

    return cols;
  }, [columns, selectable, enableExpand]);

  //currently selected row objects for bulk actions
  const selectedRows = useMemo(
    () => rows.filter((r) => selected.includes(rowId(r))),
    [rows, selected]
  );

  const [dense, setDense] = useState(false);

  //to group column
  const getGroupColSpan = (group: ColumnGroup) =>
    finalColumns.filter(
      (c) => typeof c.id === "string" && group.columns.includes(c.id)
    ).length;

  const isGroupEndColumn = (colId: string) => {
    if (!columnGroups) return false;

    return columnGroups.some(
      (group) => group.columns[group.columns.length - 1] === colId
    );
  };

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

          {/* Bulk Delete */}
          {onBulkDelete && (
            <IconButton
              onClick={() => onBulkDelete(selectedRows)}
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

          {/* Bulk Restore */}
          {onBulkRestore && (
            <IconButton
              onClick={() => onBulkRestore(selectedRows)}
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

      <TableContainer
        sx={
          enableGroupScroll
            ? {
                maxHeight: 400,
                overflowY: "auto",
              }
            : {}
        }
      >
        <Table
          stickyHeader={enableGroupScroll}
          size={dense ? "small" : "medium"}
        >
          <TableHead>
            {/* ===== GROUP HEADER ROW ===== */}
            {columnGroups && columnGroups.length > 0 && (
              <TableRow>
                {finalColumns.map((col, index) => {
                  // Status & Actions → rowSpan 2 in Groupby
                  if (
                    enableGroupScroll &&
                    (col.id === "status" || col.id === "actions")
                  ) {
                    return (
                      <TableCell
                        key={col.id}
                        align="center"
                        rowSpan={2}
                        sx={{
                          fontWeight: "bold",
                          borderBottom: "1px solid #dcdcdc",
                        }}
                      >
                        {col.label}
                      </TableCell>
                    );
                  }

                  // Selection column → empty cell
                  if (col.id === "__select__") {
                    return <TableCell key={index} />;
                  }

                  // Find which group this column belongs to
                  const group = columnGroups.find(
                    (g) =>
                      typeof col.id === "string" && g.columns.includes(col.id)
                  );

                  // Render group header only once (first column of that group)
                  if (group && group.columns[0] === col.id) {
                    return (
                      <TableCell
                        key={group.label}
                        align="center"
                        colSpan={getGroupColSpan(group)}
                        sx={{
                          fontWeight: "bold",
                          borderBottom: "1px solid #dcdcdc",
                          borderRight:
                            enableGroupScroll &&
                            columnGroups.indexOf(group) !==
                              columnGroups.length - 1
                              ? "2px solid #bdbdbd"
                              : "none",
                        }}
                      >
                        {group.label}
                      </TableCell>
                    );
                  }

                  // Skip rendering other columns of same group
                  if (group) return null;

                  // Columns without group
                  return <TableCell key={index} />;
                })}
              </TableRow>
            )}

            {/*  NORMAL COLUMN HEADER ROW  */}
            {/*  NORMAL COLUMN HEADER ROW  */}
<TableRow>
  {finalColumns.map((col, index) => {
    // Status & Actions already rendered with rowSpan in group header
    if (
      enableGroupScroll &&
      (col.id === "status" || col.id === "actions")
    ) {
      return null;
    }

    return (
      <TableCell
        key={index}
        align="center"
        sx={{
          width: col.id === "actions" ? 90 : undefined,
          borderRight:
            enableGroupScroll &&
            typeof col.id === "string" &&
            isGroupEndColumn(col.id)
              ? "2px solid #bdbdbd"
              : "none",
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
    );
  })}
</TableRow>

          </TableHead>

          <TableBody>
            {visibleRows.map((row) => {
              const id = rowId(row);
              const open = openRows[id];

              return (
                <React.Fragment key={id}>
                  {/* MAIN ROW */}
                  <TableRow>
                    {finalColumns.map((col, colIndex) => {
                      const alignment = col.cellAlign
                        ? col.cellAlign(row)
                        : col.align || "center";

                      return (
                        <TableCell
                          key={colIndex}
                          align={alignment}
                          sx={{
                            borderRight:
                              enableGroupScroll &&
                              typeof col.id === "string" &&
                              isGroupEndColumn(col.id) &&
                              !(row as any).isGroup
                                ? "2px solid #eeeeee"
                                : "none",
                          }}
                        >
                          {col.render ? col.render(row) : (row as any)[col.id]}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* COLLAPSIBLE ROW */}
                  {enableExpand && expandedContent && (
                    <TableRow>
                      <TableCell
                        colSpan={finalColumns.length}
                        sx={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <Collapse in={open} timeout="auto" unmountOnExit>
                          <Box sx={{ m: 2 }}>{expandedContent(row)}</Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #e0e0e0",
            px: 2,
          }}
        >
          {/* Dense padding toggle - LEFT */}
          <FormControlLabel
            control={
              <Switch
                checked={dense}
                onChange={(e) => setDense(e.target.checked)}
              />
            }
            label="Dense padding"
          />

          {/* Pagination - RIGHT */}
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
      )}
    </Paper>
  );
}
export default MyTable;
