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
import {
  FormProvider,
  useForm,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { restaurantInfoSchema } from "../../schemas/restaurantInfoSchema";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyButton from "../../components/newcomponents/button/MyButton";
import MyAccordion from "../../components/newcomponents/accordian/MyAccordion";
import MyDatePicker from "../../components/newcomponents/datepicker/MyDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Tooltip from "@mui/material/Tooltip";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MySnackbar from "../../components/newcomponents/snackbar/MySnackbar";
import MyTable from "../../components/newcomponents/table/MyTable";
import CheckIcon from "@mui/icons-material/Check";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { defaultRestaurantValues } from "./data/RestaurantInfoDefault";
import MyDropdown from "../../components/newcomponents/textfields/MyDropdown";
import { RESTAURANT_CATEGORIES } from "../../config/constants/RestaurantConst";
import { formatDate } from "../../utils/DateUtils";

import type {
  Control,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormTrigger,
} from "react-hook-form";

type BranchAccordionProps = {
  branchIndex: number;
  control: Control<RestaurantInfoValues>;
  branchArray: UseFieldArrayReturn<RestaurantInfoValues, "branches">;
  errors: FieldErrors<RestaurantInfoValues>;
  trigger: UseFormTrigger<RestaurantInfoValues>;
  expanded: boolean;
  onToggle: () => void;
  onBranchAdded: (index: number) => void;
};

type ComplianceRow = {
  id: string;
  _index: number;
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

  const { watch } = useFormContext<RestaurantInfoValues>();

  // Add License
  const addLicense = async () => {
    // Validate only this branch's complianceDetails
    if (complianceArray.fields.length >= 3) return;
    const valid = await trigger(`branches.${branchIndex}.complianceDetails`);
    if (valid) {
      complianceArray.append({
        licenseType: "",
        licenseNumber: "",
        validFrom: "",
        validTill: "",
      });
      setComplianceEditable((prev) => [...prev, true]);
    }
  };

  const complianceRows = complianceArray.fields.map((field, index) => ({
    id: field.id,
    _index: index,
  }));

  const [complianceEditable, setComplianceEditable] = React.useState<boolean[]>(
    complianceArray.fields.map(() => true),
  );

  const handleSaveCompliance = async (index: number) => {
    const valid = await trigger([
      `branches.${branchIndex}.complianceDetails.${index}.licenseType`,
      `branches.${branchIndex}.complianceDetails.${index}.licenseNumber`,
      `branches.${branchIndex}.complianceDetails.${index}.validFrom`,
      `branches.${branchIndex}.complianceDetails.${index}.validTill`,
    ]);

    if (valid) {
      setComplianceEditable((prev) =>
        prev.map((v, i) => (i === index ? false : v)),
      );
    }
  };

  const handleEditCompliance = (index: number) => {
    setComplianceEditable((prev) =>
      prev.map((v, i) => (i === index ? true : v)),
    );
  };

  const complianceColumns = [
    {
      id: "licenseType",
      label: "License Type",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyInput<RestaurantInfoValues>
            name={`branches.${branchIndex}.complianceDetails.${row._index}.licenseType`}
            size="small"
            sx={{ minWidth: 160 }}
            control={control}
            required
            errorMessage={
              errors.branches?.[branchIndex]?.complianceDetails?.[row._index]
                ?.licenseType?.message
            }
          />
        ) : (
          <Typography fontWeight={600}>
            {watch(
              `branches.${branchIndex}.complianceDetails.${row._index}.licenseType`,
            ) || "-"}
          </Typography>
        ),
    },
    {
      id: "licenseNumber",
      label: "License Number",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyInput<RestaurantInfoValues>
            name={`branches.${branchIndex}.complianceDetails.${row._index}.licenseNumber`}
            size="small"
            sx={{ minWidth: 160 }}
            control={control}
            required
            errorMessage={
              errors.branches?.[branchIndex]?.complianceDetails?.[row._index]
                ?.licenseNumber?.message
            }
          />
        ) : (
          <Typography fontWeight={600}>
            {watch(
              `branches.${branchIndex}.complianceDetails.${row._index}.licenseNumber`,
            ) || "-"}
          </Typography>
        ),
    },
    {
      id: "validFrom",
      label: "Valid From",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyDatePicker
            name={`branches.${branchIndex}.complianceDetails.${row._index}.validFrom`}
            size="small"
          />
        ) : (
          <Typography fontWeight={600}>
            {formatDate(
              watch(
                `branches.${branchIndex}.complianceDetails.${row._index}.validFrom`,
              ),
            )}
          </Typography>
        ),
    },
    {
      id: "validTill",
      label: "Valid Till",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyDatePicker
            name={`branches.${branchIndex}.complianceDetails.${row._index}.validTill`}
            size="small"
          />
        ) : (
          <Typography fontWeight={600}>
            {formatDate(
              watch(
                `branches.${branchIndex}.complianceDetails.${row._index}.validTill`,
              ),
            )}
          </Typography>
        ),
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      render: (row: ComplianceRow) => (
        <Box
          gap={1}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            height: "100%",
          }}
        >
          {complianceEditable[row._index] ? (
            <Tooltip title="Save">
              <IconButton
                color="success"
                onClick={() => handleSaveCompliance(row._index)}
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => handleEditCompliance(row._index)}
              >
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            color="error"
            disabled={complianceArray.fields.length === 1}
            onClick={() => {
              complianceArray.remove(row._index);
              setComplianceEditable((prev) =>
                prev.filter((_, i) => i !== row._index),
              );
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <MyAccordion
      expanded={expanded}
      onChange={() => onToggle()}
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
              onClick={(e) => {
                e.stopPropagation();
                addBranch();
              }}
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
            <MyInput<RestaurantInfoValues>
              name={`branches.${branchIndex}.branchName`}
              control={control}
              label="Branch Name"
              required
              errorMessage={errors.branches?.[branchIndex]?.branchName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MyInput<RestaurantInfoValues>
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

            <MyButton
              variant="outlined"
              onClick={addLicense}
              disabled={complianceArray.fields.length >= 3}
            >
              <AddIcon sx={{ mr: 0.5 }} />
              Add License
            </MyButton>
          </Box>

          <Box>
            <MyTable
              variant="editable"
              columns={complianceColumns}
              rows={complianceRows}
              pagination={false}
              dense={false}
            />
          </Box>
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
  const methods = useForm<RestaurantInfoValues>({
    defaultValues: defaultRestaurantValues,
    resolver: yupResolver(restaurantInfoSchema),
    mode: "onChange",
  });
  const {
    control,
    handleSubmit,
    trigger,
    reset,
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

  const onSubmit = (data: RestaurantInfoValues) => {
    console.log("FINAL SUBMIT DATA:", data);
  };

  const [expandedRestaurant, setExpandedRestaurant] = React.useState(false);
  const [expandedBranches, setExpandedBranches] = React.useState<number[]>([]);

  const [expandAll, setExpandAll] = React.useState(false);

  // Add Menu Item
  const addMenuItem = async () => {
    if (menuItemsArray.fields.length >= 3) return;
    const valid = await trigger("menuItems"); // validate current form
    if (valid) {
      menuItemsArray.append({
        itemName: "",
        category: "",
        price: 0,
        file: null,
      });
      setMenuEditable((prev) => [...prev, true]);
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

  const [resetSnackbarOpen, setResetSnackbarOpen] = React.useState(false);

  const handleReset = () => {
    reset(defaultRestaurantValues);
    setResetSnackbarOpen(true);
  };

  const [menuEditable, setMenuEditable] = React.useState<boolean[]>(
    menuItemsArray.fields.map(() => true),
  );

  const handleSaveMenuItem = async (index: number) => {
    const valid = await trigger([
      `menuItems.${index}.itemName`,
      `menuItems.${index}.category`,
      `menuItems.${index}.price`,
    ]);

    if (valid) {
      setMenuEditable((prev) => prev.map((v, i) => (i === index ? false : v)));
    }
  };

  const handleEditMenuItem = (index: number) => {
    setMenuEditable((prev) => prev.map((v, i) => (i === index ? true : v)));
  };

  const FieldLabel = ({
    label,
    value,
  }: {
    label: string;
    value?: React.ReactNode;
  }) => (
    <Box>
      <Typography fontWeight={600} variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={200}>{value || "-"}</Typography>
    </Box>
  );

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg">
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
                      <MyInput<RestaurantInfoValues>
                        name="restaurantName"
                        control={control}
                        label="Restaurant Name"
                        required
                        errorMessage={errors.restaurantName?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MyInput<RestaurantInfoValues>
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

                      <MyButton
                        variant="outlined"
                        onClick={addMenuItem}
                        disabled={menuItemsArray.fields.length >= 3}
                      >
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

                          {/* ACTION BUTTONS- Save/Edit + Delete */}
                          <Box display="flex" alignItems="center" gap={1}>
                            {menuEditable[index] ? (
                              <Tooltip title="Save">
                                <IconButton
                                  color="success"
                                  onClick={() => handleSaveMenuItem(index)}
                                >
                                  <CheckIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Edit">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEditMenuItem(index)}
                                >
                                  <EditNoteIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            <IconButton
                              onClick={() => menuItemsArray.remove(index)}
                              disabled={menuItemsArray.fields.length === 1}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* FIELDS */}
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            {menuEditable[index] ? (
                              <MyInput<RestaurantInfoValues>
                                name={`menuItems.${index}.itemName`}
                                control={control}
                                label="Item Name"
                                required
                                errorMessage={
                                  errors.menuItems?.[index]?.itemName?.message
                                }
                              />
                            ) : (
                              <FieldLabel
                                label="Item Name"
                                value={methods.watch(
                                  `menuItems.${index}.itemName`,
                                )}
                              />
                            )}
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            {menuEditable[index] ? (
                              <MyDropdown
                                name={`menuItems.${index}.category`}
                                control={control}
                                label="Category"
                                options={RESTAURANT_CATEGORIES}
                                required
                                errors={errors}
                              />
                            ) : (
                              <FieldLabel
                                label="Category"
                                value={methods.watch(
                                  `menuItems.${index}.category`,
                                )}
                              />
                            )}
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            {menuEditable[index] ? (
                              <MyInput<RestaurantInfoValues>
                                name={`menuItems.${index}.price`}
                                control={control}
                                label="Price"
                                type="number"
                                required
                                errorMessage={
                                  errors.menuItems?.[index]?.price?.message
                                }
                              />
                            ) : (
                              <FieldLabel
                                label="Price"
                                value={`₹ ${methods.watch(`menuItems.${index}.price`)}`}
                              />
                            )}
                          </Grid>

                          {/* FILE UPLOAD */}
                          <Grid size={{ xs: 12, sm: 6 }}>
                            {menuEditable[index] ? (
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
                                      <CloudUploadIcon sx={{ mr: 1 }} />
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
                            ) : (
                              <FieldLabel
                                label="Item Image"
                                value={
                                  methods.watch(`menuItems.${index}.file`)?.name
                                }
                              />
                            )}
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
                    setExpandedBranches((prev) => {
                      // include all current expanded + the clicked one + new
                      const lastBranch = branchArray.fields.length - 1;
                      const updated = Array.from(
                        new Set([...prev, lastBranch, newIndex]),
                      );
                      return updated;
                    })
                  }
                />
              ))}

              {/* SUBMIT BUTTON */}
              <Box display="flex" justifyContent="center" gap={2} mt={4}>
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
