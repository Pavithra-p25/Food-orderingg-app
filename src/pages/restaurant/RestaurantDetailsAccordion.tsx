import React from "react";
import { Box, Grid, Typography, Paper, IconButton, Tooltip } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormContext, Controller } from "react-hook-form";

import MyAccordion from "../../components/newcomponents/accordian/MyAccordion";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyDropdown from "../../components/newcomponents/textfields/MyDropdown";
import MyButton from "../../components/newcomponents/button/MyButton";

import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import { RESTAURANT_CATEGORIES } from "../../config/constants/RestaurantConst";
import { useRestaurantAccordionHandlers } from "../../hooks/useRestaurantHandlers";

type RestaurantDetailsAccordionProps = {
  expanded: boolean;
  onToggle: () => void;
};

const RestaurantDetailsAccordion: React.FC<RestaurantDetailsAccordionProps> = ({
  expanded,
  onToggle,
}) => {
  const {
    control,
    trigger,
    formState: { errors },
    watch,
  } = useFormContext<RestaurantInfoValues>();

  const {
    menuItemsArray,
    menuEditable,
    addMenuItem,
    saveMenuItem,
    editMenuItem,
    removeMenuItem,
  } = useRestaurantAccordionHandlers(control, trigger);

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
    <MyAccordion
      expanded={expanded}
      onChange={onToggle}
      sx={{ mb: 2 }}
      summary={
        <Box display="flex" alignItems="center" gap={1}>
          <RestaurantIcon color="primary" />
          <Typography fontWeight={600}>Restaurant Details</Typography>
        </Box>
      }
    >
      <Box>
        {/* Basic Info */}
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
              label="Owner Name"
              required
              errorMessage={errors.ownerName?.message}
            />
          </Grid>
        </Grid>

        {/* Menu Items */}
        <Box mt={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
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
              <AddIcon sx={{ mr: 0.5 }} /> Add Menu Item
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
              }}
            >
              {/* Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography fontWeight={600}>
                  Item {index + 1}
                </Typography>

                <Box display="flex" gap={1}>
                  {menuEditable[index] ? (
                    <Tooltip title="Save">
                      <IconButton
                        color="success"
                        onClick={() => saveMenuItem(index)}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => editMenuItem(index)}
                      >
                        <EditNoteIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  <IconButton
                    color="error"
                    onClick={() => removeMenuItem(index)}
                    disabled={menuItemsArray.fields.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Fields */}
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
                      value={watch(`menuItems.${index}.itemName`)}
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
                      value={watch(`menuItems.${index}.category`)}
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
                      value={`₹ ${watch(`menuItems.${index}.price`)}`}
                    />
                  )}
                </Grid>

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
                            {field.value?.name ??
                              "Upload Item Image"}
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
                      value={watch(`menuItems.${index}.file`)?.name}
                    />
                  )}
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      </Box>
    </MyAccordion>
  );
};

export default RestaurantDetailsAccordion;
