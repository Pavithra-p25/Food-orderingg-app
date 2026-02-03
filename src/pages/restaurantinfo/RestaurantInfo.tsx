import React, { useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import MyButton from "../../components/newcomponents/button/MyButton";
import { useDialogSnackbar } from "../../context/DialogSnackbarContext";

import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import { restaurantInfoSchema } from "../../schemas/restaurantInfoSchema";
import { defaultRestaurantValues } from "./data/RestaurantInfoDefault";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantDetailsAccordion from "./RestaurantDetailsAccordion";
import BranchAccordion from "./BranchAccordion";
import { useRestaurantInfoHandlers } from "../../hooks/useRestaurantInfoHandlers";
import { useRestaurantInfo } from "../../hooks/useRestaurantInfo";

const RestaurantInfo: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useDialogSnackbar();

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

  const { id } = useParams();
  const { restaurantInfoList, editRestaurantInfo, fetchRestaurantInfo } =
    useRestaurantInfo();
  const restaurantData = restaurantInfoList.find(
    (r) => String(r.id) === String(id),
  );

  useEffect(() => {
  fetchRestaurantInfo();
}, []);

  const isEditMode = Boolean(restaurantData);

  const branchArray = useFieldArray({
    control,
    name: "branches",
  });

  /* Prefill form in edit mode */
  useEffect(() => {
    if (restaurantData) {
      const sanitizedData = {
        ...restaurantData,
        menuItems:
          restaurantData.menuItems?.map((item: any) => ({
            ...item,
            file: item.file instanceof File ? item.file : null,
          })) || [],
      };

      reset(sanitizedData);
    }
  }, [restaurantData, reset]);

  /*  Accordion handlers  */
  const {
    expandedRestaurant,
    setExpandedRestaurant,
    expandedBranches,
    setExpandedBranches,
    expandAll,
    setExpandAll,
    handleBranchAdded,
    handleReset,
    handleSubmitForm,
  } = useRestaurantInfoHandlers(reset);

  useEffect(() => {
    if (restaurantData && branchArray.fields.length > 0) {
      setExpandedRestaurant(true);
      setExpandedBranches(branchArray.fields.map((_, i) => i));
      setExpandAll(true);
    }
  }, [restaurantData, branchArray.fields.length]);

  /*  Update handler  */
  const handleUpdate = async (data: RestaurantInfoValues) => {
    const id = data.id || restaurantData?.id;

    if (!id) {
      showSnackbar("Missing restaurant ID", "error");
      return;
    }

    try {
      await editRestaurantInfo(id, data);
      showSnackbar("Restaurant updated successfully", "success");

      setTimeout(() => {
        navigate("/RestaurantInfoList");
      }, 1500);
    } catch {
      showSnackbar("Update failed. Please try again", "error");
    }
  };

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Paper elevation={8} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Box width={40} />
              <Typography fontWeight="bold" variant="h6" textAlign="center">
                Restaurant Information
              </Typography>

              <Tooltip
                title={expandAll ? "Collapse All Forms" : "Expand All Forms"}
              >
                <IconButton onClick={() => setExpandAll((p) => !p)}>
                  <UnfoldMoreIcon
                    sx={{
                      transform: expandAll ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>

            <form
              onSubmit={handleSubmit(
                isEditMode ? handleUpdate : handleSubmitForm,
              )}
              noValidate
            >
              <RestaurantDetailsAccordion
                expanded={expandedRestaurant}
                onToggle={() => setExpandedRestaurant((p) => !p)}
                isEditMode={isEditMode}
              />

              {branchArray.fields.map((branch, index) => (
                <BranchAccordion
                  key={branch.id}
                  branchIndex={index}
                  control={control}
                  branchArray={branchArray}
                  errors={errors}
                  trigger={trigger}
                  expanded={expandedBranches.includes(index)}
                  onToggle={() =>
                    setExpandedBranches((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index],
                    )
                  }
                  onBranchAdded={handleBranchAdded}
                  isEditMode={isEditMode}
                />
              ))}

              <Box display="flex" justifyContent="center" gap={2} mt={4}>
                <MyButton
                  type="button"
                  variant="outlined"
                  onClick={handleReset}
                >
                  Reset
                </MyButton>

                <MyButton type="submit" variant="primary">
                  {isEditMode ? "Update" : "Submit"}
                </MyButton>
              </Box>
            </form>
          </Paper>
        </Container>
      </LocalizationProvider>
    </FormProvider>
  );
};

export default RestaurantInfo;
