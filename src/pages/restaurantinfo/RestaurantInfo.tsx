import React, { useEffect } from "react";
import { Container, Paper, Box, IconButton, Tooltip } from "@mui/material";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Typography from "@mui/material/Typography";
import MyButton from "../../components/newcomponents/button/MyButton";
import MySnackbar from "../../components/newcomponents/snackbar/MySnackbar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import { restaurantInfoSchema } from "../../schemas/restaurantInfoSchema";
import { defaultRestaurantValues } from "../restaurant/data/RestaurantInfoDefault";
import RestaurantDetailsAccordion from "./RestaurantDetailsAccordion";
import BranchAccordion from "./BranchAccordion";
import { useRestaurantInfoHandlers } from "../../hooks/useRestaurantInfoHandlers";
import { useNavigate } from "react-router-dom";

type RestaurantInfoProps = {
  restaurantData?: RestaurantInfoValues;
  editRestaurantInfo: (
    id: string | number,
    data: RestaurantInfoValues,
  ) => Promise<void>;
  onUpdateSuccess?: () => void;
};

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  restaurantData,
  editRestaurantInfo,
  onUpdateSuccess,
}) => {
  const navigate = useNavigate();
  const methods = useForm<RestaurantInfoValues>({
    defaultValues: defaultRestaurantValues,
    resolver: yupResolver(restaurantInfoSchema),
    mode: "onChange",
  });

  const {
    control,
    reset,
    trigger,
    formState: { errors },
    handleSubmit,
  } = methods;

  const isEditMode = Boolean(restaurantData);

  const branchArray = useFieldArray({
    control,
    name: "branches",
  });

  // Pre-fill form if restaurantData prop exists
  useEffect(() => {
    if (restaurantData) {
      const sanitizedData = {
        ...restaurantData,
        menuItems:
          restaurantData.menuItems?.map((item: any) => ({
            ...item,
            // If file is a string (URL) or not a File object, set to null to pass validation
            // (Schema expects File | null, but matches checks for File properties)
            file: item.file instanceof File ? item.file : null,
          })) || [],
      };
      console.log("Resetting form with sanitized data:", sanitizedData);
      reset(sanitizedData);
    }
  }, [restaurantData, reset]);

  

  // Use centralized handlers
  const {
    expandedRestaurant,
    setExpandedRestaurant,
    expandedBranches,
    setExpandedBranches,
    expandAll,
    setExpandAll,
    snackbar,
    setSnackbar,
    handleBranchAdded,
    handleReset,
    handleSubmitForm,
  } = useRestaurantInfoHandlers(reset);

  useEffect(() => {
  if (restaurantData && branchArray.fields.length > 0) {
    // open restaurant accordion
    setExpandedRestaurant(true);

    // open ALL branch accordions
    setExpandedBranches(
      branchArray.fields.map((_, index) => index)
    );

    // sync expand-all icon
    setExpandAll(true);
  }
}, [restaurantData, branchArray.fields.length]);

  const handleUpdate = async (data: RestaurantInfoValues) => {
    const id = data.id || restaurantData?.id;

    if (id === undefined || id === null || id === "") {
      console.error("Update aborted: Missing ID");
      return;
    }

    try {
      await editRestaurantInfo(id, data);

      // SHOW SUCCESS SNACKBAR
      setSnackbar({
        open: true,
        message: "Restaurant updated successfully",
        severity: "success",
      });

      // DELAY NAVIGATION
      setTimeout(() => {
        if (onUpdateSuccess) {
          onUpdateSuccess();
        } else {
          navigate("/restaurant"); //  table route
        }
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Update failed. Please try again",
        severity: "error",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Paper elevation={8} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
            {/* HEADER */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Box width={40} />
              <Box flex={1} textAlign="center">
                <Typography fontWeight="bold" variant="h6">
                  Restaurant Information
                </Typography>
              </Box>
              <Tooltip
                title={expandAll ? "Collapse All Forms" : "Expand All Forms"}
              >
                <IconButton
                  onClick={() => setExpandAll((prev) => !prev)}
                  sx={{
                    backgroundColor: "primary.light",
                    color: "primary.main",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                  }}
                >
                  <UnfoldMoreIcon
                    sx={{
                      transform: expandAll ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>

            <form
              onSubmit={handleSubmit(
                restaurantData ? handleUpdate : handleSubmitForm,
                (errors) => console.error("Form Validation Failed:", errors),
              )}
              noValidate
            >
              {/* RESTAURANT DETAILS */}
              <RestaurantDetailsAccordion
                expanded={expandedRestaurant}
                onToggle={() => setExpandedRestaurant((prev) => !prev)}
                 isEditMode={isEditMode}
              />

              {/* BRANCH DETAILS */}
              {branchArray.fields.map((branch, branchIndex) => (
                <BranchAccordion
                  key={branch.id}
                  branchIndex={branchIndex}
                  control={control}
                  branchArray={branchArray}
                  errors={errors}
                  trigger={trigger}
                  expanded={expandedBranches.includes(branchIndex)}
                  onToggle={() =>
                    setExpandedBranches((prev) =>
                      prev.includes(branchIndex)
                        ? prev.filter((i) => i !== branchIndex)
                        : [...prev, branchIndex],
                    )
                  }
                  onBranchAdded={handleBranchAdded}
                    isEditMode={isEditMode}
                />
              ))}

              {/* ACTION BUTTONS */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                mt={4}
                flexWrap="nowrap"
              >
                <MyButton
                  type="button"
                  variant="outlined"
                  onClick={handleReset}
                  sx={{ px: 3, py: 1, borderRadius: 2 }}
                >
                  Reset
                </MyButton>

                <MyButton
                  type="submit"
                  variant="primary"
                  sx={{ px: 3, py: 1, borderRadius: 2 }}
                >
                  {restaurantData ? "Update" : "Submit"}
                </MyButton>
              </Box>
            </form>
          </Paper>

          {/* SNACKBAR */}
          <MySnackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            autoHideDuration={2000}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            position={{ vertical: "top", horizontal: "center" }}
          />
        </Container>
      </LocalizationProvider>
    </FormProvider>
  );
};

export default RestaurantInfo;
