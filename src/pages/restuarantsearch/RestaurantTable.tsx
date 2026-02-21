import React from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import MyTable from "../../components/newcomponents/table/MyTable";
import { Chip } from "@mui/material";
import type { Restaurant } from "../../types/RestaurantTypes";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import type { Column } from "../../components/newcomponents/table/MyTable";
import { Stack } from "@mui/material";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";
import { exportData } from "../../utils/export/ExportData";
import MyButton from "../../components/newcomponents/button/MyButton";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import GridOnIcon from "@mui/icons-material/GridOn"; // for Excel representation
import { exportPdfAllTabs } from "./ExportPdfAllTabs";
import { exportExcelAllTabs } from "./ExportExcelAllTabs";

type Props = {
  results: Restaurant[];
  onEdit: (r: Restaurant) => void;
  onDelete: (ids: string[]) => void;
  onRestore: (ids: string[]) => void;
  activeTab: "all" | "active" | "inactive" | "Groupby";
  enableGrouping?: boolean;
  exportOpen: boolean;
  onCloseExport: () => void;
};

type TableRow =
  | Restaurant
  | { id: string; isGroup: true; label: string; count: number };

// Type guard to check if row is a Restaurant
const isRestaurant = (row: TableRow): row is Restaurant => !("isGroup" in row);

const RestaurantTable: React.FC<Props> = ({
  results,
  onEdit,
  onDelete,
  onRestore,
  activeTab,
  onCloseExport,
  exportOpen,
}) => {
  // Group restaurants by category
  const groupByCategory = (rows: Restaurant[]): TableRow[] => {
    const grouped = rows.reduce<Record<string, Restaurant[]>>((acc, row) => {
      const key = row.category || "Others"; // group by category
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    // Convert to a flat array with group headers
    return Object.entries(grouped).flatMap(([category, items]) => [
      {
        id: `group-${category}`,
        isGroup: true as const, // literal true
        label: category,
        count: items.length,
      },
      ...items,
    ]);
  };

  // Use grouped rows only for Group By tab
  const tableRows: TableRow[] =
    activeTab === "Groupby" ? groupByCategory(results) : results;

  // Bulk Handlers
  const handleBulkDelete = (selectedRows: Restaurant[]) => {
    const ids = selectedRows.map((r) => r.id.toString());
    onDelete(ids);
  };

  const handleBulkRestore = (selectedRows: Restaurant[]) => {
    const ids = selectedRows.map((r) => r.id.toString());
    onRestore(ids);
  };

  const isActiveTab = activeTab === "active";
  const isInactiveTab = activeTab === "inactive";

  const columnGroups = [
    {
      label: "Restaurant Info",
      columns: ["restaurantName", "category", "restaurantType"],
    },
    {
      label: "Location",
      columns: ["city", "state"],
    },
    {
      label: "Contact",
      columns: ["phone", "email"],
    },
  ];

  // Helper function to convert a Restaurant row into exportable object
  const formatRowForExport = (row: Restaurant) => {
    const rowData: Record<string, any> = {};

    baseColumns.forEach((col) => {
      if (!col.id || col.id === "actions") return;

      if (col.id === "status") {
        if (row.status === "draft") rowData[col.id] = "Draft";
        else if (row.isActive === false) rowData[col.id] = "Inactive";
        else rowData[col.id] = "Active";
      } else {
        rowData[col.id] = (row as any)[col.id] ?? "";
      }
    });

    return rowData;
  };
  const handleExport = (format: "csv" | "excel" | "pdf") => {
    if (format === "pdf") {
      const allTabs = [
        { name: "All", data: results.map(formatRowForExport) },
        {
          name: "Active",
          data: results.filter((r) => r.isActive).map(formatRowForExport),
        },
        {
          name: "Inactive",
          data: results.filter((r) => !r.isActive).map(formatRowForExport),
        },
      ];

      exportPdfAllTabs(allTabs, { orientation: "landscape" });
      onCloseExport();
      return;
    }

    let rowsToExport: TableRow[] = [];
    switch (activeTab) {
      case "Groupby":
        rowsToExport = tableRows;
        break;
      case "all":
      case "active":
      case "inactive":
        rowsToExport = tableRows;
        break;
    }

    const dataToExport = rowsToExport
      .filter(isRestaurant)
      .map(formatRowForExport); // filter here
    exportData(dataToExport, format, "Restaurants");
    onCloseExport();
  };

 const handleExcelExport = () => {
  exportExcelAllTabs(results, formatRowForExport, onCloseExport);
};

  const baseColumns: Column<TableRow>[] = [
    {
      id: "restaurantName",
      label: "Restaurant Name",
      align: "left",
      width: 210,
      minWidth: 210,
      render: (row: TableRow) => {
        if (!isRestaurant(row)) {
          return (
            <strong>
              {row.label} ({row.count})
            </strong>
          );
        }

        return (
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row.restaurantName}
          </Box>
        );
      },
    },
    {
      id: "category",
      label: "Category",
      align: "left",
    },
    {
      id: "restaurantType",
      label: "Type",
      align: "left",
    },
    {
      id: "city",
      label: "City",
      align: "left",
    },
    {
      id: "state",
      label: "State",
    },
    {
      id: "phone",
      label: "Phone",
      align: "center",
    },
    {
      id: "email",
      label: "Email",
      align: "left",
      width: 200,
      minWidth: 200,
      render: (row: TableRow) => {
        if (!isRestaurant(row)) return null;

        return (
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row.email}
          </Box>
        );
      },
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: false,
      width: 120,
      minWidth: 120,

      render: (row: TableRow) => {
        if (!isRestaurant(row)) return null;

        let label = "Active";
        let color: "success" | "error" = "success";

        if (row.status === "draft") {
          return (
            <Chip
              label="Draft"
              size="small"
              variant="outlined"
              sx={{
                color: "white",
                backgroundColor: "grey",
                borderColor: "darkgrey",
              }}
            />
          );
        } else if (row.isActive === false) {
          label = "Inactive";
          color = "error";
        }

        return (
          <Chip label={label} color={color} size="small" variant="outlined" />
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      align: "center",
      width: 100,
      minWidth: 100,

      render: (row: TableRow) => {
        if (!isRestaurant(row)) return null;

        const isDraft = row.status === "draft";
        const isInactive = !row.isActive && !isDraft;

        if (activeTab === "active") {
          return row.isActive || isDraft ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <IconButton size="small" onClick={() => onEdit(row)}>
                <EditNoteIcon color="primary" />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => onDelete([row.id.toString()])}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          ) : null;
        }

        if (activeTab === "inactive") {
          return isInactive ? (
            <RestoreIcon
              color="success"
              sx={{ cursor: "pointer" }}
              onClick={() => onRestore([row.id.toString()])}
            />
          ) : null;
        }

        if (isInactive) {
          return (
            <RestoreIcon
              color="success"
              sx={{ cursor: "pointer" }}
              onClick={() => onRestore([row.id.toString()])}
            />
          );
        }

        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton size="small" onClick={() => onEdit(row)}>
              <EditNoteIcon color="primary" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete([row.id.toString()])}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const columns =
    activeTab === "Groupby"
      ? baseColumns.map((col) => ({
          ...col,
          sortable: false,
        }))
      : baseColumns;

  return (
    <>
      <MyTable
        rows={tableRows}
        columns={columns}
        selectable={isActiveTab || isInactiveTab}
        rowId={(r: any) => r.id.toString()}
        activeTab={activeTab}
        scrollable
        columnGroups={activeTab === "Groupby" ? columnGroups : undefined}
        pagination={activeTab !== "Groupby"}
        enableGroupScroll={activeTab === "Groupby"}
        onSelectionChange={(selectedRows) => {
          console.log("Selected rows:", selectedRows);
        }}
        enableExpand={activeTab === "all" || activeTab === "Groupby"}
        expandedContent={
          activeTab === "all"
            ? (row) =>
                isRestaurant(row) && (
                  <Box sx={{ p: 2 }}>
                    {/* Heading */}
                    <Box
                      sx={{
                        mb: 1,
                        fontWeight: "bold",
                        fontSize: 14,
                        color: "gray",
                      }}
                    >
                      More Restaurant Info
                    </Box>

                    {/* Row */}
                    <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                      <Box>
                        <Box sx={{ fontSize: 12, color: "grey" }}>
                          Owner Name
                        </Box>
                        <Box>{row.ownerName || "N/A"}</Box>
                      </Box>

                      <Box>
                        <Box sx={{ fontSize: 12, color: "grey" }}>
                          Alternate Phone
                        </Box>
                        <Box>{row.alternatePhone || "N/A"}</Box>
                      </Box>

                      <Box>
                        <Box sx={{ fontSize: 12, color: "grey" }}>
                          Average Delivery Time
                        </Box>
                        <Box>
                          {row.averageDeliveryTime
                            ? `${row.averageDeliveryTime}`
                            : "N/A"}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )
            : undefined
        }
        /* bulk delete only in active tab */
        onBulkDelete={
          isActiveTab
            ? (rows) => handleBulkDelete(rows.filter(isRestaurant))
            : undefined
        }
        /* Bulk restore only in inactive tab */
        onBulkRestore={
          isInactiveTab
            ? (rows) => handleBulkRestore(rows.filter(isRestaurant))
            : undefined
        }
      />

      <MyDialog open={exportOpen} onClose={onCloseExport} maxWidth="xs">
        <Box sx={{ p: 3 }}>
          {/* Single Heading */}
          <Box
            sx={{
              mb: 3,
              fontWeight: "bold",
              fontSize: 16,
              textAlign: "center",
              color: "primary.main",
            }}
          >
            Export As
          </Box>

          {/* Buttons with icons */}
          <Stack spacing={2}>
            <MyButton
              variant="contained"
              fullWidth
              startIcon={<InsertDriveFileIcon />}
              onClick={() => handleExport("csv")}
              sx={{ textTransform: "none" }}
            >
              CSV
            </MyButton>

            <MyButton
              variant="success"
              fullWidth
              startIcon={<GridOnIcon />} // Excel icon
              onClick={handleExcelExport}
              sx={{ textTransform: "none" }}
            >
              Excel
            </MyButton>

            <MyButton
              variant="cancel"
              fullWidth
              startIcon={<PictureAsPdfIcon />} // PDF icon
              onClick={() => handleExport("pdf")}
              sx={{ textTransform: "none" }}
            >
              PDF
            </MyButton>
          </Stack>
        </Box>
      </MyDialog>
    </>
  );
};

export default RestaurantTable;
