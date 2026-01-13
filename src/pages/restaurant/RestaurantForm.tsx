import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogContent, DialogActions, Stack, Box } from "@mui/material";
import MyButton from "../../components/newcomponents/button/MyButton";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoginTab from "./LoginTab";
import RestaurantTab from "./RestaurantTab";
import ContactTab from "./ContactTab";
import LocationTab from "./LocationTab";
import MyTabs from "../../components/newcomponents/tabs/MyTab";
import MySnackbar from "../../components/newcomponents/snackbar/MySnackbar";
import { restaurantDefaultValues } from "./restaurantDefaultValues";
import { restaurantSchema } from "../../schemas/restaurantSchema";
import type { Restaurant, RestaurantTabKey } from "../../types/RestaurantTypes";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";
import { useFormHandlers } from "../../hooks/restaurant/useFormHandlers";
import { isFieldFilled } from "../../utils/RestaurantFormUtils";
import useRestaurants from "../../hooks/restaurant/useRestaurant";
import type { CreateRestaurantDTO } from "../../hooks/restaurant/useRestaurant";

interface Props {
  show: boolean; // show or hide the dialog
  onClose: (formValues: Restaurant) => void;
  restaurant?: Restaurant | null; //if present - edit mode
  onSave?: (updated: Restaurant) => void; //notify parent after save or draft
}

const RestaurantForm: React.FC<Props> = ({
  show,
  onClose,
  restaurant = null, //add mode , not null -edit mode
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<RestaurantTabKey>("login"); //which tab is currently active
  const [showConfirm, setShowConfirm] = useState(false); //confirm dialog is open or not
  const [actionType, setActionType] = useState<
    "register" | "reset" | "cancel" | null
  >(null); //which action is triggered

  const getCenterButtonLabel = () => {
    if (restaurant) return "Update"; // edit mode
    return isAllTabsValid && isLastTab ? "Register" : "Save"; // new mode
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  //json data storing
  const { addRestaurant, updateRestaurant } = useRestaurants();

  // react-hook-form with Yup schema
  const methods = useForm<Restaurant>({
    mode: "onChange", // validation occurs onChange
    reValidateMode: "onChange",
    resolver: yupResolver(restaurantSchema),
    defaultValues: restaurant || restaurantDefaultValues,
  });

  const {
    formState: { errors, isDirty }, //for tab error tracking , dirty - any changes made
    watch, //check filled fields
  } = methods;

  const watchedValues = watch();

  useEffect(() => {
    if (restaurant) {
      // Edit mode - fill with restaurant data
      methods.reset(restaurant);
    } else {
      // Add mode - reset to default values
      methods.reset(restaurantDefaultValues);
    }
  }, [restaurant, methods]);

  // which fields belong to which tab - validation/tab status tracking
  const TAB_FIELDS: Record<RestaurantTabKey, (keyof Restaurant)[]> = {
    login: ["email", "password", "confirmPassword"],
    restaurant: ["restaurantName", "restaurantType", "category"],
    contact: ["ownerName", "supportEmail", "phone"],
    location: ["address", "city", "state", "country", "pincode", "acceptTerms"],
  };

  //tab navigation order
  const tabOrder: RestaurantTabKey[] = [
    "login",
    "restaurant",
    "contact",
    "location",
  ];

  //submit handler
  const onSubmit = async (data: Restaurant) => {
    try {
      let savedRestaurant: Restaurant;

      const finalData: Restaurant = {
        ...data,
        status: "active", //  promote draft → active
        isActive: true, //  make it active
        updatedAt: new Date().toISOString(),
      };

      if (restaurant?.id) {
        // EDIT mode → update restaurant
        savedRestaurant = await updateRestaurant(restaurant.id, finalData);

        setSnackbar({
          open: true,
          message: `"${data.restaurantName}" updated successfully`,
          severity: "success",
        });
      } else {
        // NEW registration - send only allowed fields
        const { id, isActive, createdAt, updatedAt, ...rest } = data;
        const createData: CreateRestaurantDTO = { ...rest };

        savedRestaurant = await addRestaurant({
          ...createData,
          status: "active",
        });

        setSnackbar({
          open: true,
          message: "Restaurant registered successfully",
          severity: "success",
        });
      }

      if (onSave) onSave(savedRestaurant);

      setTimeout(() => {
        onClose(methods.getValues());
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save restaurant",
        severity: "error",
      });
    }
  };

  //useFormHandlers hook
  const {
    handleNext,
    handleBack,
    handleFinalSubmit,
    handleReset,
    handleTabChange,
  } = useFormHandlers({
    methods,
    tabOrder,
    tabFields: TAB_FIELDS,
    onFinalSubmit: onSubmit,
    getIsAllTabsValid: () =>
      Object.values(TAB_FIELDS).every((fields) =>
        fields.every((field) => isFieldFilled(watchedValues[field]))
      ),
    onConfirmRegister: () => handleConfirmOpen("register"),
  });

  const tabStatusMap = Object.fromEntries(
    tabOrder.map((tab) => {
      const fields = TAB_FIELDS[tab];
      const hasError = fields.some((field) => errors[field]);
      if (hasError) return [tab, "error"];
      const allFilled = fields.every((field) =>
        isFieldFilled(watchedValues[field])
      );
      return [tab, allFilled ? "success" : "neutral"];
    })
  ) as Record<RestaurantTabKey, "neutral" | "error" | "success">;

  const isAllTabsValid = Object.values(tabStatusMap).every(
    (status) => status === "success"
  );

  const hasErrors = Object.keys(errors).length > 0;

  // CONFIRMATION
  const handleConfirmOpen = (type: "register" | "reset" | "cancel") => {
    setActionType(type);
    setShowConfirm(true);
  };

  const handleConfirmYes = async () => {
    if (actionType === "register") {
      await handleFinalSubmit();
      setShowConfirm(false);
      return;
    }

    if (actionType === "reset") {
      methods.reset(restaurantDefaultValues);
      setShowConfirm(false);
      return;
    }
  };

  // ✅ UPDATED DRAFT LOGIC (single draft only)
  const handleSaveDraft = async () => {
    if (!onSave) return;

    const values = methods.getValues();

    const hasData = Object.values(values).some(
      (v) => v !== "" && v !== false && v !== undefined
    );

    if (!hasData) return;

    const draftId = values.id || Date.now().toString();

    const draft: Restaurant = {
      ...values,
      id: draftId,
      status: "draft",
      isActive: false,
      createdAt: values.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    methods.setValue("id", draftId); // reuse same draft id
    await onSave(draft);
  };

  const handleDialogClose = () => {
    const values = methods.getValues();
    onClose(values); // just close, no draft save here
  };

  const tabsData = [
    { key: "login", tabName: "Login Details", tabContent: <LoginTab /> },
    {
      key: "restaurant",
      tabName: "Restaurant Details",
      tabContent: <RestaurantTab />,
    },
    { key: "contact", tabName: "Contact Info", tabContent: <ContactTab /> },
    {
      key: "location",
      tabName: "Location Details",
      tabContent: <LocationTab />,
    },
  ];

  const activeTabIndex = tabOrder.indexOf(activeTab);
  const isFirstTab = activeTabIndex === 0;
  const isLastTab = activeTabIndex === tabOrder.length - 1;

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MyDialog
          open={show}
          onClose={handleDialogClose}
          title="Register Your Restaurant"
        >
          <Box
            sx={{ minHeight: 400, display: "flex", flexDirection: "column" }}
          >
            <MyTabs
              tabs={tabsData}
              activeTab={tabOrder.indexOf(activeTab)}
              onTabChange={(index) =>
                handleTabChange(activeTab, tabOrder[index], setActiveTab)
              }
              tabStatus={tabStatusMap}
            />
          </Box>

          <DialogActions sx={{ justifyContent: "space-between", paddingX: 3 }}>
            <MyButton
              variant="outlined"
              onClick={() => handleBack(activeTab, setActiveTab)}
              disabled={isFirstTab}
            >
              Back
            </MyButton>

            <Stack direction="row" spacing={2}>
              <MyButton
                variant="success"
                onClick={async () => {
                  if (restaurant) {
                    await handleFinalSubmit();
                    return;
                  }

                  if (isAllTabsValid && isLastTab) {
                    handleConfirmOpen("register");
                    return;
                  }

                  await handleSaveDraft(); // save same draft
                  handleNext(activeTab, setActiveTab);
                }}
              >
                {getCenterButtonLabel()}
              </MyButton>

              <MyButton
                variant="outlined"
                onClick={() =>
                  handleReset(setActiveTab, isDirty, hasErrors, () =>
                    handleConfirmOpen("reset")
                  )
                }
              >
                Reset
              </MyButton>
            </Stack>

            <MyButton
              variant="contained"
              onClick={() => handleNext(activeTab, setActiveTab)}
              disabled={isLastTab}
            >
              Next
            </MyButton>
          </DialogActions>
        </MyDialog>

        <MyDialog
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          maxWidth="xs"
        >
          <DialogContent sx={{ textAlign: "center" }}>
            {actionType === "register"
              ? "Proceed with restaurant registration?"
              : "Are you sure?"}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 3 }}
            >
              <MyButton
                variant="outlined"
                onClick={() => setShowConfirm(false)}
              >
                No
              </MyButton>
              <MyButton variant="contained" onClick={handleConfirmYes}>
                Yes
              </MyButton>
            </Stack>
          </DialogContent>
        </MyDialog>

        <MySnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </LocalizationProvider>
    </FormProvider>
  );
};

export default RestaurantForm;
