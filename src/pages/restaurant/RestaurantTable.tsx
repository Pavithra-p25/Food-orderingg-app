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
  onDelete: (r: Restaurant) => void;
  onRestore: (r: Restaurant) => void;
};

const RestaurantTable: React.FC<Props> = ({
  results,
  onEdit,
  onDelete,
  onRestore,
}) => {
  return (
    <MyTable
      rows={results}
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
          label: "Phone Number",
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
          render: (r: Restaurant) => (
            <Chip
              label={r.isActive === false ? "Inactive" : "Active"}
              color={r.isActive === false ? "error" : "success"}
              size="small"
              variant="outlined"
            />
          ),
        },
        {
          id: "actions",
          label: "Actions",
          sortable: false,
          render: (r: Restaurant) => {
            const isInactive = r.isActive === false;

            return (
              <>
                {/* EDIT ICON */}
                <EditNoteIcon
                  color={isInactive ? "disabled" : "primary"}
                  sx={{
                    cursor: isInactive ? "not-allowed" : "pointer",
                    mr: 1,
                  }}
                  onClick={() => {
                    if (isInactive) return;
                    onEdit(r);
                  }}
                />

                {/* DELETE (Active) / RESTORE (Inactive) */}
                {isInactive ? (
                  <RestoreIcon
                    color="success"
                    sx={{ cursor: "pointer" }}
                    onClick={() => onRestore(r)}
                  />
                ) : (
                  <MyButton
                    variant="outline-secondary"
                    style={{ minWidth: 0, padding: 0 }}
                    onClick={() => onDelete(r)}
                  >
                    <DeleteIcon color="error" />
                  </MyButton>
                )}
              </>
            );
          },
        },
      ]}
    />
  );
};

export default RestaurantTable;
