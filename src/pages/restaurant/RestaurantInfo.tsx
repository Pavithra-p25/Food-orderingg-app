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
import { useRestaurantInfoHandlers } from "../../hooks/useRestaurantInfoHandlers";

const RestaurantInfo = () => {
  const methods = useForm<RestaurantInfoValues>({
    defaultValues: defaultRestaurantValues,
    resolver: yupResolver(restaurantInfoSchema),
    mode: "onChange",
  });

  const { control, reset, trigger ,formState: { errors }, handleSubmit } = methods;

  const branchArray = useFieldArray({
    control,
    name: "branches",
  });

  const { restaurantInfoList } = useRestaurantInfo();

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

  const restaurantColumns = [
    { id: "restaurantName", label: "Restaurant Name", sortable: true, align: "center" as const },
    { id: "ownerName", label: "Owner Name", align: "center" as const },
    { id: "branches", label: "Branches", render: (row: any) => row.branches?.length ?? 0 },
    { id: "menuItems", label: "Menu Items", render: (row: any) => row.menuItems?.length ?? 0 },
  ];

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Paper elevation={8} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
            {/* HEADER */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box width={40} />
              <Box flex={1} textAlign="center">
                <Typography fontWeight="bold" variant="h6">Restaurant Information</Typography>
              </Box>
              <Tooltip title={expandAll ? "Collapse All Forms" : "Expand All Forms"}>
                <IconButton
                  onClick={() => setExpandAll(prev => !prev)}
                  sx={{
                    backgroundColor: "primary.light",
                    color: "primary.main",
                    transition: "all 0.3s ease",
                    "&:hover": { backgroundColor: "primary.main", color: "white" },
                  }}
                >
                  <UnfoldMoreIcon sx={{ transform: expandAll ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />
                </IconButton>
              </Tooltip>
            </Box>

            <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
              {/* RESTAURANT DETAILS */}
              <RestaurantDetailsAccordion
                expanded={expandedRestaurant}
                onToggle={() => setExpandedRestaurant(prev => !prev)}
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
                    setExpandedBranches(prev =>
                      prev.includes(branchIndex)
                        ? prev.filter(i => i !== branchIndex)
                        : [...prev, branchIndex]
                    )
                  }
                  onBranchAdded={handleBranchAdded}
                />
              ))}

              {/* ACTION BUTTONS */}
              <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={4} flexWrap="nowrap">
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

            {/* SUBMITTED RESTAURANTS */}
            {restaurantInfoList.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Submitted Restaurant Details</Typography>
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <Box sx={{ minWidth: 650 }}>
                    <MyTable
                      columns={restaurantColumns}
                      rows={restaurantInfoList}
                      rowId={(row: any) => row.id}
                      enableExpand
                      selectable={false}
                      pagination={false}
                      dense={false}
                      expandedContent={(row: any) => (
                        <Box>
                          <Typography fontWeight="bold" mb={1}>Owner</Typography>
                          <Typography mb={2}>{row.ownerName}</Typography>

                          <Typography fontWeight="bold" mb={1}>Branches</Typography>
                          {row.branches?.map((branch: any, bIndex: number) => (
                            <Paper key={bIndex} sx={{ p: 2, mb: 2 }}>
                              <Typography fontWeight="bold">{branch.branchName} ({branch.branchCode})</Typography>

                              {branch.complianceDetails?.length > 0 && (
                                <Box mt={1}>
                                  <Typography fontWeight="bold" fontSize={14}>Compliance Details</Typography>
                                  {branch.complianceDetails.map((c: any, cIndex: number) => (
                                    <Box key={cIndex} ml={2} mt={0.5}>
                                      • {c.licenseType.toUpperCase()} – {c.licenseNumber}
                                      <br />
                                      <small>{new Date(c.validFrom).toLocaleDateString()} → {new Date(c.validTill).toLocaleDateString()}</small>
                                    </Box>
                                  ))}
                                </Box>
                              )}
                            </Paper>
                          ))}

                          <Typography fontWeight="bold" mb={1}>Menu Items</Typography>
                          {row.menuItems?.map((item: any, i: number) => (
                            <Box key={i} ml={2} mb={0.5}>
                              • {item.itemName} ({item.category}) – ₹{item.price}
                            </Box>
                          ))}
                        </Box>
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>

          {/* SNACKBAR */}
          <MySnackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            autoHideDuration={2000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            position={{ vertical: "top", horizontal: "center" }}
          />
        </Container>
      </LocalizationProvider>
    </FormProvider>
  );
};

export default RestaurantInfo;
