import React, { useState, useEffect } from "react";
import { Container, Grid, DialogContent, Stack } from "@mui/material";
import MyButton from "../../components/newcomponents/button/MyButton";
import { useForm } from "react-hook-form";
import useRestaurants from "../../hooks/restaurant/useRestaurant";
import type { Restaurant } from "../../types/RestaurantTypes";
import { useNavigate } from "react-router-dom";
import { restaurantDefaultValues } from "../restaurant/data/restaurantDefaultValues";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";
import MyTab from "../../components/newcomponents/tabs/MyTab";
import RestaurantSearchForm from "./RestaurantSearchForm";
import RestaurantTable from "./RestaurantTable";
import { Box } from "@mui/material";
// HOOK
import { useRestaurantTableActions } from "../../hooks/restaurant/useRestaurantTableActions";
import { useDialogSnackbar } from "../../context/DialogSnackbarContext";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const RestaurantSearch: React.FC = () => {
  const navigate = useNavigate();

  const methods = useForm<Restaurant>({
    defaultValues: { ...restaurantDefaultValues },
  });

  const { handleSubmit, reset } = methods;
  const { showSnackbar } = useDialogSnackbar();

  const [openExport, setOpenExport] = useState(false);
  const [results, setResults] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  //hook for api actions
  const {
    getAllRestaurants,
    softDeleteRestaurant,
    activateRestaurant,
    deleteRestaurant,
  } = useRestaurants();

  // ACTIONS HOOK
  const {
    showConfirm,
    pendingAction,
    pendingIds,
    handleDeleteClick,
    handleRestoreClick,
    handleConfirmYes,
    handleConfirmNo,
  } = useRestaurantTableActions(
    softDeleteRestaurant,
    activateRestaurant,
    deleteRestaurant,
  );
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();

        const safeData: Restaurant[] = data ?? [];

        setAllRestaurants(safeData);
        setResults(safeData);
      } catch (err: any) {
        showSnackbar(err?.message || "Failed to fetch restaurants", "error");
        setAllRestaurants([]);
        setResults([]);
      }
    };

    fetchRestaurants();
  }, [getAllRestaurants, showSnackbar]);

  const handleReset = () => {
    reset(restaurantDefaultValues); //reset search form
    setResults(allRestaurants); // table
  };

  //to show count of datas
  const allCount = results.length;

  const activeCount = results.filter(
    (r) => r.isActive && r.status !== "draft",
  ).length;

  const inactiveCount = results.filter(
    (r) => !r.isActive && r.status !== "draft",
  ).length;

  //search logic
  const onSubmit = async (data: Restaurant) => {
    try {
      const filtered = allRestaurants.filter((res: Restaurant) => {
        const match = (fieldValue?: string, inputValue?: string) =>
          inputValue
            ? fieldValue
                ?.toLowerCase()
                .includes(inputValue.toLowerCase().trim())
            : true; // important change
        console.log("Submitted Type:", data.restaurantType);
        console.log("Type of Submitted:", typeof data.restaurantType);

        // String fields
        const stringFields: (keyof Restaurant)[] = [
          "restaurantName",
          "category",
          "city",
          "state",
          "phone",
          "email",
        ];

        const stringMatch = stringFields.every((field) =>
          match(res[field] as string, data[field] as string),
        );
        const selectedType = data.restaurantType as any;

        const typeMatch =
          selectedType && selectedType.length > 0
            ? res.restaurantType?.includes(selectedType)
            : true;

        // Now BOTH must match
        return stringMatch && typeMatch;
      });

      setResults(filtered);
    } catch (error) {
      console.error("Failed to filter restaurants:", error);
      setResults([]);
    }
  };

  const activeRestaurants = results.filter(
    (r) => r.isActive && r.status !== "draft",
  );

  const tabs = [
    {
      key: "all",
      tabName: `All (${allCount})`,
      tabContent: (
        <RestaurantTable
          results={results}
          onEdit={(r) => navigate(`/restaurant/edit/${r.id}`)}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreClick}
          activeTab="all"
          exportOpen={openExport}
          onCloseExport={() => setOpenExport(false)}
        />
      ),
    },
    {
      key: "active",
      tabName: `Active (${activeCount})`,
      tabContent: (
        <RestaurantTable
          results={results.filter((r) => r.isActive && r.status !== "draft")}
          onEdit={(r) => navigate(`/restaurant/edit/${r.id}`)}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreClick}
          activeTab="active"
          exportOpen={openExport}
          onCloseExport={() => setOpenExport(false)}
        />
      ),
    },
    {
      key: "inactive",
      tabName: `Inactive (${inactiveCount})`,
      tabContent: (
        <RestaurantTable
          results={results.filter((r) => !r.isActive && r.status !== "draft")}
          onEdit={(r) => navigate(`/restaurant/edit/${r.id}`)}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreClick}
          activeTab="inactive"
          exportOpen={openExport}
          onCloseExport={() => setOpenExport(false)}
        />
      ),
    },
    {
      key: "groupBy",
      tabName: "Group By",
      tabContent: (
        <RestaurantTable
          results={activeRestaurants}
          onEdit={(r) => navigate(`/restaurant/edit/${r.id}`)}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreClick}
          activeTab="Groupby"
          enableGrouping
          exportOpen={openExport}
          onCloseExport={() => setOpenExport(false)}
        />
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* SEARCH FORM CONTAINER */}
        <Grid size={12}>
          <RestaurantSearchForm
            methods={methods}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            handleReset={handleReset}
            onAdd={() => navigate("/restaurant/register")}
          />
        </Grid>

        {/* RESULTS TABLE */}
        <Grid size={12}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 3,
              p: 3,
            }}
          >
            <Stack spacing={3}>
              {/* Export Button */}
              <Stack direction="row" justifyContent="flex-end">
                <MyButton
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => setOpenExport(true)}
                >
                  Export
                </MyButton>
              </Stack>

              {/* Tabs + Table */}
              <MyTab
                tabs={tabs}
                tabStatus={{
                  all: "neutral",
                  active: "success",
                  inactive: "error",
                }}
              />
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* CONFIRMATION DIALOG */}
      <MyDialog open={showConfirm} onClose={handleConfirmNo} maxWidth="xs">
        <DialogContent sx={{ textAlign: "center" }}>
          {pendingAction === "delete"
            ? pendingIds.length === 1
              ? "Are you sure you want to delete this restaurant?"
              : `Are you sure you want to delete ${pendingIds.length} restaurants?`
            : pendingIds.length === 1
              ? "Are you sure you want to restore this restaurant?"
              : `Are you sure you want to restore ${pendingIds.length} restaurants?`}

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <MyButton variant="outlined" onClick={handleConfirmNo}>
              No
            </MyButton>
            <MyButton
              variant="contained"
              onClick={() =>
                handleConfirmYes(allRestaurants, setAllRestaurants, setResults)
              }
            >
              Yes
            </MyButton>
          </Stack>
        </DialogContent>
      </MyDialog>
    </Container>
  );
};

export default RestaurantSearch;
