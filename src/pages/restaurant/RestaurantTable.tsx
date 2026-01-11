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
};


const RestaurantTable: React.FC<Props> = ({
  results,
  onEdit,
  onDelete,
  onRestore,
}) => {
   // Bulk Handlers
  const handleBulkDelete = (selectedRows: Restaurant[]) => {
  const ids = selectedRows.map(r => r.id.toString());
  onDelete(ids);
};

const handleBulkRestore = (selectedRows: Restaurant[]) => {
  const ids = selectedRows.map(r => r.id.toString());
  onRestore(ids);
};



  return (
    <MyTable
      rows={results}
      selectable
      rowId={(r) => r.id.toString()}
      onSelectionChange={(selectedRows) => {
        console.log("Selected rows:", selectedRows);
      }}
      onBulkDelete={handleBulkDelete}
      onBulkRestore={handleBulkRestore}
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
                {isInactive ? (
                  /*  ONLY RESTORE ICON FOR INACTIVE */
                  <RestoreIcon
                    color="success"
                    sx={{ cursor: "pointer" }}
                   onClick={() => onRestore([r.id.toString()])}
                  />
                ) : (
                  /*  EDIT +  DELETE FOR ACTIVE */
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
