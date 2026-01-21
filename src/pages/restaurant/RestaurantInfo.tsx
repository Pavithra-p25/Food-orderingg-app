import React from "react";
import { Box, Container, Typography, Paper, IconButton } from "@mui/material";
import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import StoreIcon from "@mui/icons-material/Store";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { restaurantInfoSchema } from "../../schemas/restaurantInfoSchema";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyButton from "../../components/newcomponents/button/MyButton";
import MyAccordion from "../../components/newcomponents/accordian/MyAccordion";
import MyDatePicker from "../../components/newcomponents/datepicker/MyDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { FormValues } from "../../types/RestaurantInfoTypes";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Tooltip from "@mui/material/Tooltip";

import type {
  Control,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormTrigger,
} from "react-hook-form";

type BranchAccordionProps = {
  branchIndex: number;
  control: Control<FormValues>;
  branchArray: UseFieldArrayReturn<FormValues, "branches">;
  errors: FieldErrors<FormValues>;
  trigger: UseFormTrigger<FormValues>;
  expanded: boolean;
  onToggle: () => void;
  onBranchAdded: (index: number) => void;
};

//  Branch Accordion
const BranchAccordion: React.FC<BranchAccordionProps> = ({
  branchIndex,
  control,
  branchArray,
  errors,
  trigger,
  expanded,
  onToggle,
  onBranchAdded,
}) => {
  const complianceArray = useFieldArray({
    control,
    name: `branches.${branchIndex}.complianceDetails`,
  });

  //add branch
  const addBranch = async () => {
    if (branchArray.fields.length >= 3) return;

    const valid = await trigger("branches");
    if (valid) {
      const newIndex = branchArray.fields.length;

      branchArray.append({
        branchName: "",
        branchCode: "",
        complianceDetails: [
          { licenseType: "", licenseNumber: "", validFrom: "", validTill: "" },
        ],
      });

      onBranchAdded(newIndex);
    }
  };

  // Add License
  const addLicense = async () => {
    // Validate only this branch's complianceDetails
    const valid = await trigger(`branches.${branchIndex}.complianceDetails`);
    if (valid) {
      complianceArray.append({
        licenseType: "",
        licenseNumber: "",
        validFrom: "",
        validTill: "",
      });
    }
  };

  return (
    <MyAccordion
      expanded={expanded}
      onChange={onToggle}
      sx={{ mb: 2 }}
      summary={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          {/* LEFT: ICON + TITLE */}
          <Box display="flex" alignItems="center" gap={1}>
            <StoreIcon color="secondary" />
            <Typography fontWeight={600}>
              Branch Details {branchIndex + 1}
            </Typography>
          </Box>

          {/* ADD BRANCH BUTTON */}
          {branchIndex === branchArray.fields.length - 1 && (
            <MyButton
              variant="outlined"
              onClick={addBranch}
              disabled={branchArray.fields.length >= 3}
            >
              <AddIcon sx={{ mr: 0.5 }} />
              Add Branch
            </MyButton>
          )}
        </Box>
      }
    >
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MyInput<FormValues>
              name={`branches.${branchIndex}.branchName`}
              control={control}
              label="Branch Name"
              required
              errorMessage={errors.branches?.[branchIndex]?.branchName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MyInput<FormValues>
              name={`branches.${branchIndex}.branchCode`}
              control={control}
              required
              label="Branch Code"
              errorMessage={errors.branches?.[branchIndex]?.branchCode?.message}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          {/* HEADER */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <DescriptionIcon color="secondary" />
              <Typography fontWeight={700}>Compliance Details</Typography>
            </Box>

            <MyButton variant="outlined" onClick={addLicense}>
              <AddIcon sx={{ mr: 0.5 }} />
              Add License
            </MyButton>
          </Box>

          {complianceArray.fields.map((item, cIndex) => (
            <Paper
              key={item.id}
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                backgroundColor: "grey.50",
              }}
            >
              {/* CARD HEADER */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography fontWeight={600}>License {cIndex + 1}</Typography>

                <IconButton
                  color="error"
                  disabled={complianceArray.fields.length === 1}
                  onClick={() => complianceArray.remove(cIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {/* FIELDS */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MyInput<FormValues>
                    name={`branches.${branchIndex}.complianceDetails.${cIndex}.licenseType`}
                    control={control}
                    label="License Type"
                    required
                    errorMessage={
                      errors.branches?.[branchIndex]?.complianceDetails?.[
                        cIndex
                      ]?.licenseType?.message
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MyInput<FormValues>
                    name={`branches.${branchIndex}.complianceDetails.${cIndex}.licenseNumber`}
                    control={control}
                    label="License Number"
                    required
                    errorMessage={
                      errors.branches?.[branchIndex]?.complianceDetails?.[
                        cIndex
                      ]?.licenseNumber?.message
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MyDatePicker
                    name={`branches.${branchIndex}.complianceDetails.${cIndex}.validFrom`}
                    label="Valid From"
                    disablePast={false}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <MyDatePicker
                    name={`branches.${branchIndex}.complianceDetails.${cIndex}.validTill`}
                    label="Valid Till"
                    disableFuture={false}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        {branchArray.fields.length > 1 && (
          <Box mt={2} display="flex" justifyContent="flex-start">
            <MyButton
              variant="outlined-cancel"
              onClick={() => branchArray.remove(branchIndex)}
            >
              Remove Branch
            </MyButton>
          </Box>
        )}
      </Box>
    </MyAccordion>
  );
};

//  Main Component
const RestaurantInfo = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      restaurantName: "",
      ownerName: "",
      menuItems: [{ itemName: "", category: "", price: 0, file: null }],
      branches: [
        {
          branchName: "",
          branchCode: "",
          complianceDetails: [
            {
              licenseType: "",
              licenseNumber: "",
              validFrom: "",
              validTill: "",
            },
          ],
        },
      ],
    },
    resolver: yupResolver(restaurantInfoSchema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const menuItemsArray = useFieldArray({
    control,
    name: "menuItems",
  });

  const branchArray = useFieldArray({
    control,
    name: "branches",
  });

  const onSubmit = (data: FormValues) => {
    console.log("FINAL SUBMIT DATA:", data);
  };

  const [expandedRestaurant, setExpandedRestaurant] = React.useState(false);
  const [expandedBranches, setExpandedBranches] = React.useState<number[]>([]);

  const [expandAll, setExpandAll] = React.useState(false);

  // Add Menu Item
  const addMenuItem = async () => {
    const valid = await trigger("menuItems"); // validate current form
    if (valid) {
      menuItemsArray.append({
        itemName: "",
        category: "",
        price: 0,
        file: null,
      });
    }
  };

  React.useEffect(() => {
    if (expandAll) {
      setExpandedRestaurant(true);
      setExpandedBranches(branchArray.fields.map((_, index) => index));
    } else {
      setExpandedRestaurant(false);
      setExpandedBranches([]);
    }
  }, [expandAll, branchArray.fields.length]);

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="md">
          <Paper elevation={8} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Box flex={1} display="flex" justifyContent="center">
                <Typography variant="h5" fontWeight="bold">
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
                    transform: expandAll ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                  }}
                >
                  <UnfoldMoreIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* RESTAURANT DETAILS */}
              <MyAccordion
                expanded={expandedRestaurant} // controlled by state
                onChange={() => setExpandedRestaurant((prev) => !prev)} // toggle state
                sx={{ mb: 2 }}
                summary={
                  <>
                    <RestaurantIcon color="primary" />
                    <Typography ml={1} fontWeight={600}>
                      Restaurant Details
                    </Typography>
                  </>
                }
              >
                <Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MyInput<FormValues>
                        name="restaurantName"
                        control={control}
                        label="Restaurant Name"
                        required
                        errorMessage={errors.restaurantName?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MyInput<FormValues>
                        name="ownerName"
                        control={control}
                        required
                        label="Owner Name"
                        errorMessage={errors.ownerName?.message}
                      />
                    </Grid>
                  </Grid>

                  <Box mt={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <RestaurantMenuIcon color="primary" />
                        <Typography fontWeight={700}>Menu Items</Typography>
                      </Box>

                      <MyButton variant="outlined" onClick={addMenuItem}>
                        <AddIcon sx={{ mr: 0.5 }} />
                        Add Menu Item
                      </MyButton>
                    </Box>

                    {menuItemsArray.fields.map((item, index) => (
                      <Paper
                        key={item.id}
                        elevation={4}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 3,
                          backgroundColor: "grey.50",
                          position: "relative",
                        }}
                      >
                        {/* HEADER */}
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Typography fontWeight={600}>
                            Item {index + 1}
                          </Typography>

                          <IconButton
                            onClick={() => menuItemsArray.remove(index)}
                            disabled={menuItemsArray.fields.length === 1}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        {/* FIELDS */}
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <MyInput<FormValues>
                              name={`menuItems.${index}.itemName`}
                              control={control}
                              label="Item Name"
                              required
                              errorMessage={
                                errors.menuItems?.[index]?.itemName?.message
                              }
                            />
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <MyInput<FormValues>
                              name={`menuItems.${index}.category`}
                              control={control}
                              label="Category"
                              required
                              errorMessage={
                                errors.menuItems?.[index]?.category?.message
                              }
                            />
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <MyInput<FormValues>
                              name={`menuItems.${index}.price`}
                              control={control}
                              label="Price"
                              required
                              type="number"
                              errorMessage={
                                errors.menuItems?.[index]?.price?.message
                              }
                            />
                          </Grid>

                          {/* FILE UPLOAD */}
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                              name={`menuItems.${index}.file`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <MyButton
                                    variant="outlined"
                                    fullWidth
                                    sx={{ height: 56 }}
                                    onClick={() =>
                                      document
                                        .getElementById(`menu-file-${index}`)
                                        ?.click()
                                    }
                                  >
                                    {field.value?.name ?? "Upload Item Image"}
                                  </MyButton>

                                  <input
                                    type="file"
                                    hidden
                                    id={`menu-file-${index}`}
                                    accept="image/*"
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.files?.[0] || null,
                                      )
                                    }
                                  />
                                </>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </MyAccordion>

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
                    setExpandedBranches(
                      (prev) =>
                        prev.includes(branchIndex)
                          ? prev.filter((i) => i !== branchIndex) // close
                          : [...prev, branchIndex], // open
                    )
                  }
                  onBranchAdded={(newIndex: number) =>
                    setExpandedBranches((prev) => [...prev, newIndex])
                  }
                />
              ))}

              {/* SUBMIT BUTTON */}
              <Box display="flex" justifyContent="center" mt={4}>
                <MyButton
                  type="submit"
                  variant="primary"
                  sx={{ px: 3, py: 1, borderRadius: 2 }}
                >
                  Submit
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
