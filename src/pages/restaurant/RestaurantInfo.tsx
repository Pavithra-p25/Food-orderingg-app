import React from "react";
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
import { defaultRestaurantValues } from "./data/RestaurantInfoDefault";
import RestaurantDetailsAccordion from "./RestaurantDetailsAccordion";
import BranchAccordion from "./BranchAccordion";
import { useRestaurantInfo } from "../../hooks/useRestaurantInfo";
import MyTable from "../../components/newcomponents/table/MyTable";

const RestaurantInfo = () => {
  const methods = useForm<RestaurantInfoValues>({
    defaultValues: defaultRestaurantValues,
    resolver: yupResolver(restaurantInfoSchema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = methods;

  const branchArray = useFieldArray({
    control,
    name: "branches",
  });

  const { addRestaurantInfo, restaurantInfoList, fetchRestaurantInfo } =
    useRestaurantInfo();

  const [expandedRestaurant, setExpandedRestaurant] = React.useState(false);
  const [expandedBranches, setExpandedBranches] = React.useState<number[]>([]);
  const [expandAll, setExpandAll] = React.useState(false);

  const handleBranchAdded = (newIndex: number) => {
    setExpandedBranches((prev) => [...prev, newIndex]); // automatically expand the new branch
  };

  /* Expand / Collapse ALL */
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
    setSnackbar({
      open: true,
      message: "Form reset successfully",
      severity: "success",
    });
  };

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const onSubmit = async (data: RestaurantInfoValues) => {
    try {
      await addRestaurantInfo(data);
      await fetchRestaurantInfo();

      setSnackbar({
        open: true,
        message: "Form submitted successfully!",
        severity: "success",
      });

      reset(defaultRestaurantValues);
    } catch {
      setSnackbar({
        open: true,
        message: "Submission failed!",
        severity: "error",
      });
    }
  };

  const restaurantColumns = [
    {
      id: "restaurantName",
      label: "Restaurant Name",
      sortable: true,
      align: "center" as const,
    },
    { id: "ownerName", label: "Owner Name", align: "center" as const },
    {
      id: "branches",
      label: "Branches",
      render: (row: any) => row.branches?.length ?? 0,
    },
    {
      id: "menuItems",
      label: "Menu Items",
      render: (row: any) => row.menuItems?.length ?? 0,
    },
  ];

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 1, sm: 2, md: 3 }, // mobile-friendly side padding
          }}
        >
          <Paper elevation={8} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
            {/* HEADER */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              {/* Left spacer (keeps title centered) */}
              <Box width={40} />

              {/* Title */}
              <Box flex={1} textAlign="center">
                <Typography fontWeight="bold" variant="h6">
                  Restaurant Information
                </Typography>
              </Box>

              {/* Expand / Collapse Icon */}
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

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* RESTAURANT DETAILS */}
              <RestaurantDetailsAccordion
                expanded={expandedRestaurant}
                onToggle={() => setExpandedRestaurant((prev) => !prev)}
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
                  variant="contained"
                  onClick={handleReset}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: "grey.600",
                    color: "white",
                  }}
                >
                  Reset
                </MyButton>

                <MyButton
                  type="submit"
                  variant="primary"
                  sx={{ px: 3, py: 1, borderRadius: 2 }}
                >
                  Submit
                </MyButton>
              </Box>
            </form>
            {restaurantInfoList.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Submitted Restaurant Details
                </Typography>

                <MyTable
                  columns={restaurantColumns}
                  rows={restaurantInfoList}
                  rowId={(row: any) => row.id}
                  enableExpand
                  selectable={false} // row selection
                  pagination={false} // disable pagination
                  dense={false}
                  expandedContent={(row: any) => (
                    <Box>
                      {/* OWNER */}
                      <Typography fontWeight="bold" mb={1}>
                        Owner
                      </Typography>
                      <Typography mb={2}>{row.ownerName}</Typography>

                      {/* BRANCHES */}
                      <Typography fontWeight="bold" mb={1}>
                        Branches
                      </Typography>

                      {row.branches?.map((branch: any, bIndex: number) => (
                        <Paper key={bIndex} sx={{ p: 2, mb: 2 }}>
                          <Typography fontWeight="bold">
                            {branch.branchName} ({branch.branchCode})
                          </Typography>

                          {/* COMPLIANCE */}
                          {branch.complianceDetails?.length > 0 && (
                            <Box mt={1}>
                              <Typography fontWeight="bold" fontSize={14}>
                                Compliance Details
                              </Typography>

                              {branch.complianceDetails.map(
                                (c: any, cIndex: number) => (
                                  <Box key={cIndex} ml={2} mt={0.5}>
                                    • {c.licenseType.toUpperCase()} –{" "}
                                    {c.licenseNumber}
                                    <br />
                                    <small>
                                      {new Date(
                                        c.validFrom,
                                      ).toLocaleDateString()}{" "}
                                      →{" "}
                                      {new Date(
                                        c.validTill,
                                      ).toLocaleDateString()}
                                    </small>
                                  </Box>
                                ),
                              )}
                            </Box>
                          )}
                        </Paper>
                      ))}

                      {/* MENU ITEMS */}
                      <Typography fontWeight="bold" mb={1}>
                        Menu Items
                      </Typography>

                      {row.menuItems?.map((item: any, i: number) => (
                        <Box key={i} ml={2} mb={0.5}>
                          • {item.itemName} ({item.category}) – ₹{item.price}
                        </Box>
                      ))}
                    </Box>
                  )}
                />
              </Box>
            )}
          </Paper>

          <MySnackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            position={{ vertical: "top", horizontal: "center" }}
          />
        </Container>
      </LocalizationProvider>
    </FormProvider>
  );
};

export default RestaurantInfo;
