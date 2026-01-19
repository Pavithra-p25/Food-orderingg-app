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
  id: keyof T | string;
  label: string | React.ReactNode;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  cellAlign?: (row: any) => "left" | "center" | "right";
}

type ColumnGroup = {
  label: string;
  columns: string[];
};

interface MyTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  selectable?: boolean;
  columnGroups?: ColumnGroup[];
  rowId?: (row: T) => string;
  onSelectionChange?: (rows: T[]) => void;
  onBulkDelete?: (rows: T[]) => void;
  onBulkRestore?: (rows: T[]) => void;
  expandedContent?: (row: T) => React.ReactNode;
  enableExpand?: boolean;
  pagination?: boolean;
  enableGroupScroll?: boolean;
  activeTab?: string;
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
  columnGroups,
  rowId = (row: any) => row.id,
  onSelectionChange,
  onBulkDelete,
  onBulkRestore,
  expandedContent,
  enableExpand,
  pagination = true,
  enableGroupScroll = false,
  activeTab,
}: MyTableProps<T>) {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [expandAll, setExpandAll] = useState(false);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [dense, setDense] = useState(false);

  

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked
      ? rows.filter((r: any) => !r.isGroup).map(rowId)
      : [];

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

  const isGroupRowOpen = (groupId: string) => openRows[groupId];

  useEffect(() => setPage(0), [rows]);

  useEffect(() => {
    if (activeTab !== undefined) {
      setSelected([]);
      onSelectionChange?.([]);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!enableExpand) return;

    const allRowsState: Record<string, boolean> = {};
    rows.forEach((row) => {
      allRowsState[rowId(row)] = expandAll;
    });
    setOpenRows(allRowsState);
  }, [expandAll, rows, enableExpand]);

  const handleSort = (id: string) => {
    if (orderBy === id) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(id);
      setOrder("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (orderBy === null) return rows;
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

  const visibleRows = useMemo(() => {
    if (!pagination) return sortedRows;
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage, pagination]);

  const toggleRow = (id: string) =>
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  const isGroupByTab = activeTab === "Groupby";

  const toggleAllGroups = () => {
    const groupRows = rows.filter((r: any) => r.isGroup);

    const shouldOpen = groupRows.some((g: any) => !openRows[rowId(g)]);

    const newState: Record<string, boolean> = {};
    groupRows.forEach((g: any) => {
      newState[rowId(g)] = shouldOpen;
    });

    setOpenRows((prev: Record<string, boolean>) => ({
      ...prev,
      ...newState,
    }));
  };

  const expandColumn: Column<T> = {
    id: "__expand__",
    label: (
      <IconButton
        size="small"
        onClick={() => {
          if (isGroupByTab) {
            toggleAllGroups();
          } else {
            setExpandAll((prev) => !prev);
          }
        }}
        sx={{
         cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        }}
      >
        {isGroupByTab ? (
          Object.values(openRows).some(Boolean) ? (
            <KeyboardArrowUpIcon fontSize="small" />
          ) : (
            <KeyboardArrowDownIcon fontSize="small" />
          )
        ) : expandAll ? (
          <KeyboardArrowUpIcon fontSize="small" />
        ) : (
          <KeyboardArrowDownIcon fontSize="small" />
        )}
      </IconButton>
    ),
    sortable: false,
    align: "center",
    render: (row: T) => {
      const id = rowId(row);
      return (
        <IconButton
          size="small"
          onClick={() => toggleRow(id)}
          sx={{ width: 32, height: 32, minWidth: 32, padding: 0 }}
        >
          {openRows[id] ? (
            <KeyboardArrowUpIcon fontSize="small" />
          ) : (
            <KeyboardArrowDownIcon fontSize="small" />
          )}
        </IconButton>
      );
    },
  };

  const selectableRows = rows.filter((r: any) => !r.isGroup);

  const selectionColumn: Column<T> = {
    id: "__select__",
    label: (
      <Checkbox
        indeterminate={
          selected.length > 0 && selected.length < selectableRows.length
        }
        checked={
          selectableRows.length > 0 && selected.length === selectableRows.length
        }
        onClick={(e) => e.stopPropagation()}
        onChange={(_, checked) => handleSelectAll(checked)}
      />
    ),
    sortable: false,
    align: "center",
    render: (row: any) => {
      if (row.isGroup) return null;
      return (
        <Checkbox
          checked={selected.includes(rowId(row))}
          onClick={(e) => {
            e.stopPropagation();
            handleRowSelect(rowId(row));
          }}
        />
      );
    },
  };

  const finalColumns = useMemo(() => {
    let cols = columns;
    if (selectable) cols = [selectionColumn, ...cols];
    if (enableExpand) cols = [expandColumn, ...cols];
    return cols;
  }, [columns, selectable, enableExpand, selected, openRows]);

  const selectedRows = useMemo(
    () => rows.filter((r: any) => !r.isGroup && selected.includes(rowId(r))),
    [rows, selected],
  );

  const getGroupColSpan = (group: ColumnGroup) =>
    finalColumns.filter(
      (c) => typeof c.id === "string" && group.columns.includes(c.id),
    ).length;

  const isGroupEndColumn = (colId: string) => {
    if (!columnGroups) return false;
    return columnGroups.some(
      (group) => group.columns[group.columns.length - 1] === colId,
    );
  };

  const shouldRenderRow = (row: any, index: number) => {
    if (!row.isGroup) {
      const parentGroup = visibleRows
        .slice(0, index)
        .reverse()
        .find((r: any) => r.isGroup);
      if (parentGroup) return openRows[rowId(parentGroup)];
    }
    return true;
  };

  useEffect(() => {
    console.log("Selected rows changed:", selectedRows);
  }, [selectedRows]);

  return (
    <Paper sx={{ width: "100%" }}>
      {/* Bulk Actions Toolbar */}
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
        sx={{
          maxHeight: 450,
          overflowY: "auto",
        }}
      >
        <Table size={dense ? "small" : "medium"}>
          <TableHead>
            {/* GROUP HEADER ROW */}
            {columnGroups && columnGroups.length > 0 && (
              <TableRow
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  backgroundColor: "white",
                }}
              >
                {finalColumns.map((col, index) => {
                  if (
                    enableGroupScroll &&
                    (col.id === "status" || col.id === "actions")
                  ) {
                    return (
                      <TableCell
                        key={col.id}
                        rowSpan={2}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#9e9e9e",
                          borderBottom: "1px solid #dcdcdc",
                          position: "sticky",
                          top: 0,
                          zIndex: 4,
                          padding: 0,
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 2,
                          }}
                        >
                          {col.label}
                        </Box>
                      </TableCell>
                    );
                  }

                  if (col.id === "__select__") return <TableCell key={index} />;

                  const group = columnGroups.find(
                    (g) =>
                      typeof col.id === "string" && g.columns.includes(col.id),
                  );

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

                  if (group) return null;

                  return <TableCell key={index} />;
                })}
              </TableRow>
            )}

            {/* NORMAL COLUMN HEADER ROW */}
            <TableRow
              sx={{
                position: "sticky",
                top: columnGroups && columnGroups.length > 0 ? 55 : 0,
                zIndex: 2,
                backgroundColor: "white",
              }}
            >
              {finalColumns.map((col, index) => {
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
            {visibleRows.map((row: any, rowIndex) => {
              if (!shouldRenderRow(row, rowIndex)) return null;

              const id = rowId(row);
              const open = openRows[id];

              return (
                <React.Fragment key={id}>
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
                          {row.isGroup && colIndex === 0 ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setOpenRows((prev) => ({
                                    ...prev,
                                    [id]: !prev[id],
                                  }))
                                }
                              >
                                {isGroupRowOpen(id) ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>

                              <strong>
                                {row.label} ({row.count})
                              </strong>
                            </Box>
                          ) : row.isGroup ? null : col.render ? ( // skip rendering for other columns in group rows
                            col.render(row)
                          ) : (
                            (row as any)[col.id]
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>

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
          <FormControlLabel
            control={
              <Switch
                checked={dense}
                onChange={(e) => setDense(e.target.checked)}
              />
            }
            label="Dense padding"
          />

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
