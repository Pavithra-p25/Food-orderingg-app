import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Fade,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ContactsIcon from "@mui/icons-material/Contacts";
import StoreIcon from "@mui/icons-material/Store";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { restaurantInfoSchema } from "../../schemas/restaurantInfoSchema";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyButton from "../../components/newcomponents/button/MyButton";
import MyAccordion from "../../components/newcomponents/accordian/MyAccordion";

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
    <MyAccordion
      expanded={expanded === `branch-${branchIndex}`}
      onChange={handleChange(`branch-${branchIndex}`)}
      sx={{ mb: 2 }}
      summary={
        <>
          <StoreIcon color="secondary" />
          <Typography ml={1} fontWeight={600}>
            Branch Details {branchIndex + 1}
          </Typography>
        </>
      }
    >
      <Fade in={expanded === `branch-${branchIndex}`}>
        <Box>
          {branchIndex === branchArray.fields.length - 1 && (
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <MyButton
                variant="text"
                onClick={() =>
                  branchArray.append({
                    branchName: "",
                    branchCode: "",
                    branchContacts: [{ name: "", phone: "", email: "" }],
                  })
                }
              >
                <AddIcon style={{ marginRight: 4 }} />
                Add Branch
              </MyButton>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <MyInput<FormValues>
                name={`branches.${branchIndex}.branchName`}
                control={control}
                label="Branch Name"
                errorMessage={
                  errors.branches?.[branchIndex]?.branchName?.message
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <MyInput<FormValues>
                name={`branches.${branchIndex}.branchCode`}
                control={control}
                label="Branch Code"
                errorMessage={
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

            <MyButton
              variant="primary"
              onClick={async () => {
                const lastIndex = branchContacts.fields.length - 1;
                const valid = await trigger([
                  `branches.${branchIndex}.branchContacts.${lastIndex}.name`,
                  `branches.${branchIndex}.branchContacts.${lastIndex}.phone`,
                ]);
                if (!valid) return;

                branchContacts.append({ name: "", phone: "", email: "" });
              }}
            >
              <AddIcon style={{ marginRight: 4 }} />
              Add Contact
            </MyButton>
          </Box>

          {branchContacts.fields.map((contact, contactIndex) => {
            const contactErrors =
              errors.branches?.[branchIndex]?.branchContacts?.[contactIndex] ||
              {};
            return (
              <Box key={contact.id} mt={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyInput<FormValues>
                      name={`branches.${branchIndex}.branchContacts.${contactIndex}.name`}
                      control={control}
                      label="Contact Name"
                      errorMessage={contactErrors.name?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyInput<FormValues>
                      name={`branches.${branchIndex}.branchContacts.${contactIndex}.phone`}
                      control={control}
                      label="Phone"
                      errorMessage={contactErrors.phone?.message}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} mt={1} alignItems="center">
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyInput<FormValues>
                      name={`branches.${branchIndex}.branchContacts.${contactIndex}.email`}
                      control={control}
                      label="Email"
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
              <MyButton
                variant="cancel"
                onClick={() => branchArray.remove(branchIndex)}
              >
                Remove Branch
              </MyButton>
            </Box>
          )}
        </Box>
      </Fade>
    </MyAccordion>
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
          <MyAccordion
            expanded={expanded === "restaurant"}
            onChange={handleChange("restaurant")}
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
            <Fade in={expanded === "restaurant"}>
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyInput<FormValues>
                      name="restaurantName"
                      control={control}
                      label="Restaurant Name"
                      errorMessage={errors.restaurantName?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyInput<FormValues>
                      name="ownerName"
                      control={control}
                      label="Owner Name"
                      errorMessage={errors.ownerName?.message}
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

                  <MyButton
                    variant="primary"
                    onClick={async () => {
                      const lastIndex = restaurantContacts.fields.length - 1;
                      const valid = await trigger([
                        `restaurantContacts.${lastIndex}.name`,
                        `restaurantContacts.${lastIndex}.phone`,
                      ]);
                      if (!valid) return;

                      restaurantContacts.append({
                        name: "",
                        phone: "",
                        email: "",
                      });
                    }}
                  >
                    <AddIcon style={{ marginRight: 4 }} />
                    Add Contact
                  </MyButton>
                </Box>

                {restaurantContacts.fields.map((field, index) => {
                  const contactErrors =
                    errors.restaurantContacts?.[index] || {};
                  return (
                    <Box key={field.id} mt={2}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MyInput<FormValues>
                            name={`restaurantContacts.${index}.name`}
                            control={control}
                            label="Contact Name"
                            errorMessage={contactErrors.name?.message}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MyInput<FormValues>
                            name={`restaurantContacts.${index}.phone`}
                            control={control}
                            label="Phone"
                            errorMessage={contactErrors.phone?.message}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} mt={1} alignItems="center">
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MyInput<FormValues>
                            name={`restaurantContacts.${index}.email`}
                            control={control}
                            label="Email"
                            type="email"
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
          </MyAccordion>

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
            <MyButton
              type="submit"
              variant="primary"
              sx={{ px: 6, py: 1.5, borderRadius: 3 }}
            >
              Submit
            </MyButton>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default RestaurantInfo;
