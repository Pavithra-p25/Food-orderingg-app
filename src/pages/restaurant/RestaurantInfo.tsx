import React from "react";
import { Container, Paper, Box, IconButton, Tooltip } from "@mui/material";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import MyButton from "../../components/newcomponents/button/MyButton";
import MySnackbar from "../../components/newcomponents/snackbar/MySnackbar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import { restaurantInfoSchema } from "../../schemas/restaurantInfoSchema";
import { defaultRestaurantValues } from "./data/RestaurantInfoDefault";
import RestaurantDetailsAccordion from "./RestaurantDetailsAccordion";
import BranchAccordion from "./BranchAccordion";

const RestaurantInfo = () => {
  const methods = useForm<RestaurantInfoValues>({
    defaultValues: defaultRestaurantValues,
    resolver: yupResolver(restaurantInfoSchema),
    mode: "onChange",
  });

  const { control, handleSubmit, reset, trigger, formState: { errors } } = methods;

  const branchArray = useFieldArray({
    control,
    name: "branches",
  });

  const [expandedRestaurant, setExpandedRestaurant] = React.useState(false);
  const [expandedBranches, setExpandedBranches] = React.useState<number[]>([]);
  const [expandAll, setExpandAll] = React.useState(false);
  const [resetSnackbarOpen, setResetSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    if (expandAll) {
      setExpandedRestaurant(true);
      setExpandedBranches(branchArray.fields.map((_, index) => index));
    } else {
      setExpandedRestaurant(false);
      setExpandedBranches([]);
    }
  }, [expandAll, branchArray.fields.length]);

  const handleReset = () => {
    reset(defaultRestaurantValues);
    setResetSnackbarOpen(true);
  };

  const onSubmit = (data: RestaurantInfoValues) => {
    console.log("FINAL SUBMIT DATA:", data);
  };

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg">
          <Paper elevation={8} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box flex={1} display="flex" justifyContent="center">
                <h5 style={{ fontWeight: "bold" }}>Restaurant Information</h5>
              </Box>

              <Tooltip title={expandAll ? "Collapse All Forms" : "Expand All Forms"}>
                <IconButton
                  onClick={() => setExpandAll((prev) => !prev)}
                  sx={{
                    backgroundColor: "primary.light",
                    color: "primary.main",
                    transform: expandAll ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    "&:hover": { backgroundColor: "primary.main", color: "white" },
                  }}
                >
                  <UnfoldMoreIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* RESTAURANT DETAILS ACCORDION */}
              <RestaurantDetailsAccordion
                expanded={expandedRestaurant}
                onToggle={() => setExpandedRestaurant((prev) => !prev)}
              />

              {/* BRANCH DETAILS ACCORDION */}
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
                        : [...prev, branchIndex]
                    )
                  }
                  onBranchAdded={(newIndex: number) =>
                    setExpandedBranches((prev) => {
                      const lastBranch = branchArray.fields.length - 1;
                      return Array.from(new Set([...prev, lastBranch, newIndex]));
                    })
                  }
                />
              ))}

              {/* SUBMIT + RESET BUTTONS */}
              <Box display="flex" justifyContent="center" gap={2} mt={4}>
                <MyButton
                  type="button"
                  variant="contained"
                  onClick={handleReset}
                  sx={{ px: 3, py: 1, borderRadius: 2, backgroundColor: "grey.600", color: "white" }}
                >
                  Reset
                </MyButton>

                <MyButton type="submit" variant="primary" sx={{ px: 3, py: 1, borderRadius: 2 }}>
                  Submit
                </MyButton>
              </Box>
            </form>
          </Paper>

          <MySnackbar
            open={resetSnackbarOpen}
            message="Form reset successfully"
            severity="success"
            onClose={() => setResetSnackbarOpen(false)}
            position={{ vertical: "top", horizontal: "center" }}
          />
        </Container>
      </LocalizationProvider>
    </FormProvider>
  );
};

export default RestaurantInfo;
