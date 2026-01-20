import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Fade,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ContactsIcon from "@mui/icons-material/Contacts";
import StoreIcon from "@mui/icons-material/Store";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { restaurantInfoSchema } from "../../schemas/restaurantInfoSchema";

//  Types 
type Contact = {
  name: string;
  phone: string;
  email?: string;
};

type Branch = {
  branchName: string;
  branchCode: string;
  branchContacts: Contact[];
};

type FormValues = {
  restaurantName: string;
  ownerName: string;
  restaurantContacts: Contact[];
  branches: Branch[];
};

//  Branch Accordion 
const BranchAccordion = ({
  branchIndex,
  expanded,
  handleChange,
  control,
  register,
  branchArray,
  errors,
  trigger,
}: {
  branchIndex: number;
  expanded: string | false;
  handleChange: (panel: string) => (e: any, isExpanded: boolean) => void;
  control: any;
  register: any;
  branchArray: any;
  errors: any;
  trigger: any;
}) => {
  const branchContacts = useFieldArray({
    control,
    name: `branches.${branchIndex}.branchContacts`,
  });

  return (
    <Accordion
      expanded={expanded === `branch-${branchIndex}`}
      onChange={handleChange(`branch-${branchIndex}`)}
      sx={{ mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <StoreIcon color="secondary" />
        <Typography ml={1} fontWeight={600}>
          Branch Details {branchIndex + 1}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Fade in={expanded === `branch-${branchIndex}`}>
          <Box>
            {branchIndex === branchArray.fields.length - 1 && (
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    branchArray.append({
                      branchName: "",
                      branchCode: "",
                      branchContacts: [{ name: "", phone: "", email: "" }],
                    })
                  }
                >
                  Add Branch
                </Button>
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Branch Name"
                  fullWidth
                  {...register(`branches.${branchIndex}.branchName` as const)}
                  error={!!errors.branches?.[branchIndex]?.branchName}
                  helperText={
                    errors.branches?.[branchIndex]?.branchName?.message
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Branch Code"
                  fullWidth
                  {...register(`branches.${branchIndex}.branchCode` as const)}
                  error={!!errors.branches?.[branchIndex]?.branchCode}
                  helperText={
                    errors.branches?.[branchIndex]?.branchCode?.message
                  }
                />
              </Grid>
            </Grid>

            {/* Branch Contacts */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={3}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <ContactsIcon color="secondary" />
                <Typography fontWeight={600}>Branch Contacts</Typography>
              </Box>
           
              <Button
                startIcon={<AddIcon />}
                onClick={async () => {
                  const lastIndex = branchContacts.fields.length - 1;
                  const valid = await trigger([
                    `branches.${branchIndex}.branchContacts.${lastIndex}.name`,
                    `branches.${branchIndex}.branchContacts.${lastIndex}.phone`,
                  ]);
                  if (!valid) return;

                  branchContacts.append({ name: "", phone: "", email: "" });
                }}
                size="small"
              >
                Add Contact
              </Button>
            </Box>

            {branchContacts.fields.map((contact, contactIndex) => {
              const contactErrors =
                errors.branches?.[branchIndex]?.branchContacts?.[
                  contactIndex
                ] || {};
              return (
                <Box key={contact.id} mt={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Contact Name"
                        fullWidth
                        {...register(
                          `branches.${branchIndex}.branchContacts.${contactIndex}.name` as const,
                        )}
                        error={!!contactErrors.name}
                        helperText={contactErrors.name?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Phone"
                        fullWidth
                        {...register(
                          `branches.${branchIndex}.branchContacts.${contactIndex}.phone` as const,
                        )}
                        error={!!contactErrors.phone}
                        helperText={contactErrors.phone?.message}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} mt={1} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Email"
                        fullWidth
                        {...register(
                          `branches.${branchIndex}.branchContacts.${contactIndex}.email` as const,
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} textAlign="right">
                      <IconButton
                        onClick={() => branchContacts.remove(contactIndex)}
                        disabled={branchContacts.fields.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              );
            })}

            {branchArray.fields.length > 1 && (
              <Box mt={2} display="flex" justifyContent="flex-start">
                <Button
                  color="error"
                  onClick={() => branchArray.remove(branchIndex)}
                >
                  Remove Branch
                </Button>
              </Box>
            )}
          </Box>
        </Fade>
      </AccordionDetails>
    </Accordion>
  );
};

//  Main Component
const RestaurantInfo = () => {
  const [expanded, setExpanded] = useState<string | false>("restaurant");

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      restaurantContacts: [{ name: "", phone: "", email: "" }],
      branches: [
        {
          branchName: "",
          branchCode: "",
          branchContacts: [{ name: "", phone: "", email: "" }],
        },
      ],
    },
    resolver: yupResolver(restaurantInfoSchema) as any,
    mode: "onChange", 
    reValidateMode: "onChange",
  });

  const restaurantContacts = useFieldArray({
    control,
    name: "restaurantContacts",
  });

  const branchArray = useFieldArray({
    control,
    name: "branches",
  });

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const onSubmit = (data: FormValues) => {
    console.log("FINAL SUBMIT DATA:", data);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={8} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Restaurant Information
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* RESTAURANT DETAILS */}
          <Accordion
            expanded={expanded === "restaurant"}
            onChange={handleChange("restaurant")}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <RestaurantIcon color="primary" />
              <Typography ml={1} fontWeight={600}>
                Restaurant Details
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Fade in={expanded === "restaurant"}>
                <Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Restaurant Name"
                        fullWidth
                        {...register("restaurantName")}
                        error={!!errors.restaurantName}
                        helperText={errors.restaurantName?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Owner Name"
                        fullWidth
                        {...register("ownerName")}
                        error={!!errors.ownerName}
                        helperText={errors.ownerName?.message}
                      />
                    </Grid>
                  </Grid>

                  {/* Restaurant Contacts */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={3}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <ContactsIcon color="primary" />
                      <Typography fontWeight={600}>Contact Persons</Typography>
                    </Box>
                    
                    <Button
                      startIcon={<AddIcon />}
                      onClick={async () => {
                        // Trigger validation for last contact
                        const lastIndex = restaurantContacts.fields.length - 1;
                        const valid = await trigger([
                          `restaurantContacts.${lastIndex}.name`,
                          `restaurantContacts.${lastIndex}.phone`,
                        ]);
                        if (!valid) return; // stop if last contact is invalid

                        restaurantContacts.append({
                          name: "",
                          phone: "",
                          email: "",
                        });
                      }}
                      size="small"
                    >
                      Add Contact
                    </Button>
                  </Box>

                  {restaurantContacts.fields.map((field, index) => {
                    const contactErrors =
                      errors.restaurantContacts?.[index] || {};
                    return (
                      <Box key={field.id} mt={2}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Contact Name"
                              fullWidth
                              {...register(
                                `restaurantContacts.${index}.name` as const,
                              )}
                              error={!!contactErrors.name}
                              helperText={contactErrors.name?.message}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Phone"
                              fullWidth
                              {...register(
                                `restaurantContacts.${index}.phone` as const,
                              )}
                              error={!!contactErrors.phone}
                              helperText={contactErrors.phone?.message}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} mt={1} alignItems="center">
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Email"
                              type="email"
                              fullWidth
                              {...register(
                                `restaurantContacts.${index}.email` as const,
                              )}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }} textAlign="right">
                            <IconButton
                              onClick={() => restaurantContacts.remove(index)}
                              disabled={restaurantContacts.fields.length === 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                </Box>
              </Fade>
            </AccordionDetails>
          </Accordion>

          {/* BRANCH DETAILS */}
          {branchArray.fields.map((branch, branchIndex) => (
            <BranchAccordion
              key={branch.id}
              branchIndex={branchIndex}
              expanded={expanded}
              handleChange={handleChange}
              control={control}
              register={register}
              branchArray={branchArray}
              errors={errors}
              trigger={trigger}
            />
          ))}

          {/* SUBMIT BUTTON */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ px: 6, py: 1.5, borderRadius: 3 }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default RestaurantInfo;
