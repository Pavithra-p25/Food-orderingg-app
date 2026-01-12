import React from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import MyButton from "../../components/newcomponents/button/MyButton";
import MyTable from "../../components/newcomponents/table/MyTable";
import { Chip } from "@mui/material";
import type { Restaurant } from "../../types/RestaurantTypes";

type Props = {
  results: Restaurant[];
  onEdit: (r: Restaurant) => void;
  onDelete: (ids: string[]) => void;
  onRestore: (ids: string[]) => void;
  activeTab: "all" | "active" | "inactive";
};

const RestaurantTable: React.FC<Props> = ({
  results,
  onEdit,
  onDelete,
  onRestore,
  activeTab,
}) => {
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

  return (
    <MyTable
      rows={results}
      selectable={isActiveTab || isInactiveTab}
      rowId={(r) => r.id.toString()}
      onSelectionChange={(selectedRows) => {
        console.log("Selected rows:", selectedRows);
      }}
      /* ulk delete only in active tab */
      onBulkDelete={isActiveTab ? handleBulkDelete : undefined}
      /* Bulk restore only in inactive tab */
      onBulkRestore={isInactiveTab ? handleBulkRestore : undefined}
      columns={[
        {
          id: "restaurantName",
          label: "Restaurant Name",
          align: "left",
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
  render: (r: Restaurant) => {
    let label = "Active";
    let color: "success" | "error"  = "success";

   if (r.status === "draft") {
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
    } else if (r.isActive === false) {
      label = "Inactive";
      color = "error";
    }

    return <Chip label={label} color={color} size="small" variant="outlined" />;
  },
},
       {
  id: "actions",
  label: "Actions",
  sortable: false,
  render: (r: Restaurant) => {
    const isDraft = r.status === "draft";
const isInactive = !r.isActive && !isDraft;


    if (activeTab === "active") {
      // Active tab - show edit + delete for active and draft
      return r.isActive || isDraft ? (
        <>
          <EditNoteIcon
            color="primary"
            sx={{ cursor: "pointer", mr: 1 }}
            onClick={() => onEdit(r)}
          />
          <MyButton
            variant="outline-secondary"
            style={{ minWidth: 0, padding: 0 }}
            onClick={() => onDelete([r.id.toString()])}
          >
            <DeleteIcon color="error" />
          </MyButton>
        </>
      ) : null;
    }

    if (activeTab === "inactive") {
      // Inactive tab - show only restore for inactive
      return isInactive ? (
        <RestoreIcon
          color="success"
          sx={{ cursor: "pointer" }}
          onClick={() => onRestore([r.id.toString()])}
        />
      ) : null;
    }

    // All tab - show actions based on status
    if (isInactive) {
      return (
        <RestoreIcon
          color="success"
          sx={{ cursor: "pointer" }}
          onClick={() => onRestore([r.id.toString()])}
        />
      );
    }

    // Draft or active - show edit + delete
    return (
      <>
        <EditNoteIcon
          color="primary"
          sx={{ cursor: "pointer", mr: 1 }}
          onClick={() => onEdit(r)}
        />
        <MyButton
          variant="outline-secondary"
          style={{ minWidth: 0, padding: 0 }}
          onClick={() => onDelete([r.id.toString()])}
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
