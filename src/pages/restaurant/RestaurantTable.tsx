import React from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import MyButton from "../../components/newcomponents/button/MyButton";
import MyTable from "../../components/newcomponents/table/MyTable";
import { Chip } from "@mui/material";
import type { Restaurant } from "../../types/RestaurantTypes";
import { Box } from "@mui/material";

type Props = {
  results: Restaurant[];
  onEdit: (r: Restaurant) => void;
  onDelete: (ids: string[]) => void;
  onRestore: (ids: string[]) => void;
  activeTab: "all" | "active" | "inactive" | "Groupby";
  enableGrouping?: boolean;
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

  return (
    <MyTable
      rows={tableRows}
      selectable={isActiveTab || isInactiveTab}
      rowId={(r: any) => r.id.toString()}
      activeTab={activeTab}
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
                      <Box sx={{ fontSize: 12, color: "grey" }}>Owner Name</Box>
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
      columns={[
        {
          id: "restaurantName",
          label: "Restaurant Name",
          align: "left",
          render: (row: TableRow) => {
            if (!isRestaurant(row)) {
              return (
                <strong>
                  {row.label} ({row.count})
                </strong>
              );
            }
            return row.restaurantName;
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
        },
        {
          id: "status",
          label: "Status",
          align: "center",
          sortable: false,
          render: (row: TableRow) => {
            if (!isRestaurant(row)) return null;

            let label = "Active";
            let color: "success" | "error" = "success";

            if (row.status === "draft") {
              label = "Draft";
              return (
                <Chip
                  label={label}
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
              <Chip
                label={label}
                color={color}
                size="small"
                variant="outlined"
              />
            );
          },
        },
        {
          id: "actions",
          label: "Actions",
          sortable: false,
          render: (row: TableRow) => {
            if (!isRestaurant(row)) return null;

            const isDraft = row.status === "draft";
            const isInactive = !row.isActive && !isDraft;

            if (activeTab === "active") {
              return row.isActive || isDraft ? (
                <>
                  <EditNoteIcon
                    color="primary"
                    sx={{ cursor: "pointer", mr: 1 }}
                    onClick={() => onEdit(row)}
                  />
                  <MyButton
                    variant="outline-secondary"
                    style={{ minWidth: 0, padding: 0 }}
                    onClick={() => onDelete([row.id.toString()])}
                  >
                    <DeleteIcon color="error" />
                  </MyButton>
                </>
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

            // All tab
            if (isInactive) {
              return (
                <RestoreIcon
                  color="success"
                  sx={{ cursor: "pointer" }}
                  onClick={() => onRestore([row.id.toString()])}
                />
              );
            }

            // Draft or active
            return (
              <>
                <EditNoteIcon
                  color="primary"
                  sx={{ cursor: "pointer", mr: 1 }}
                  onClick={() => onEdit(row)}
                />
                <MyButton
                  variant="outline-secondary"
                  style={{ minWidth: 0, padding: 0 }}
                  onClick={() => onDelete([row.id.toString()])}
                >
                  <DeleteIcon color="error" />
                </MyButton>
              </>
            );
          },
        },
      ]}
    />
  );
};

export default RestaurantTable;
