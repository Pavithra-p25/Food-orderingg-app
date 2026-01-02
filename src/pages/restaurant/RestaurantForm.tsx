import React, { useState } from "react";
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
import { isFieldFilled } from "../../utils/formutils";

interface Props {
  show: boolean; // show or hide the dialog
  onClose: () => void; // to close the dialog
}

const RestaurantForm: React.FC<Props> = ({ show, onClose }) => {
  const [activeTab, setActiveTab] = useState<RestaurantTabKey>("login"); //which tab is currently active
  const [showConfirm, setShowConfirm] = useState(false); //confirm dialog is open or not
  const [actionType, setActionType] =
    useState<"register" | "reset" | "cancel" | null>(null); //which action is triggered
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  // react-hook-form with Yup schema
  const methods = useForm<Restaurant>({
    mode: "onChange", // validation occurs onChange
    resolver: yupResolver(restaurantSchema),
    defaultValues: restaurantDefaultValues,
  });

  const {
    formState: { errors, isDirty }, //for tab error tracking , dirty - any changes made
    watch, //check filled fields

  } = methods;

  const watchedValues = watch();

  // which fields belong to which tab - validation/tab status tracking
  const TAB_FIELDS: Record<RestaurantTabKey, (keyof Restaurant)[]> = {
    login: ["email", "password", "confirmPassword"],
    restaurant: ["restaurantName", "restaurantType", "category"],
    contact: ["ownerName", "supportEmail", "phone"],
    location: ["address", "city", "state", "country", "pincode"],
  };

  //tab navigation order
  const tabOrder: RestaurantTabKey[] = [
    "login",
    "restaurant",
    "contact",
    "location",
  ];

  //run only when full form is valid
  const onSubmit = (data: Restaurant) => {
    console.log("Submitted data:", data);
    setSnackbar({
      open: true,
      message: "Restaurant registered successfully",
      severity: "success",
    });
    onClose();
  };

  //useFormHandlers hook
  const {
    handleNext,
    handleBack,
    handleFinalSubmit,
    handleReset,
    handleNextOrRegister,
    handleTabChange,
  } = useFormHandlers({
    form: methods,
    tabOrder,
    tabFields: TAB_FIELDS,
    onFinalSubmit: onSubmit,

    //function to check if all tabs are valid , passed to useFormHandlers, hook decide when to show register
    getIsAllTabsValid: () =>
      Object.values(TAB_FIELDS).every((fields) =>
        fields.every((field) =>
          isFieldFilled(watchedValues[field])
        )
      ),

    onConfirmRegister: () => handleConfirmOpen("register"),
  });

  const tabStatusMap = Object.fromEntries( //track current tab status
    tabOrder.map((tab) => {
      const fields = TAB_FIELDS[tab]; //fields in the tab
      const hasError = fields.some((field) => errors[field]); //any field has error
      if (hasError) return [tab, "error"]; //rhf error

      //runs per tab to check all fields filled
      const allFilled = fields.every((field) =>
        isFieldFilled(watchedValues[field])
      );
      return [tab, allFilled ? "success" : "neutral"];
    })
  ) as Record<RestaurantTabKey, "neutral" | "error" | "success">;

  const isAllTabsValid = Object.values(tabStatusMap).every(
    (status) => status === "success"
  );

  const hasErrors = Object.keys(errors).length > 0; //convert errors object to array and check length

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
      handleReset(setActiveTab, isDirty, hasErrors, () =>
        handleConfirmOpen("reset")
      );
      setSnackbar({
        open: true,
        message: "Form reset successfully",
        severity: "info",
      });
      setShowConfirm(false);
      return;
    }

    if (actionType === "cancel") {
      onClose();
      setShowConfirm(false);
    }
  };

  const tabsData = [
    { key: "login", tabName: "Login Details", tabContent: <LoginTab /> },
    { key: "restaurant", tabName: "Restaurant Details", tabContent: <RestaurantTab /> },
    { key: "contact", tabName: "Contact Info", tabContent: <ContactTab /> },
    { key: "location", tabName: "Location Details", tabContent: <LocationTab /> },
  ];

  const activeTabIndex = tabOrder.indexOf(activeTab);
  const isFirstTab = activeTabIndex === 0;
  const isLastTab = activeTabIndex === tabOrder.length - 1;

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* MAIN FORM MODAL */}
        <MyDialog open={show} onClose={onClose} title="Register Your Restaurant">
          <Box sx={{ minHeight: 400, display: "flex", flexDirection: "column" }}>
            <MyTabs
              tabs={tabsData}
              activeTab={tabOrder.indexOf(activeTab)}
              onTabChange={(index) =>
                handleTabChange(
                  activeTab,
                  tabOrder[index],
                  setActiveTab
                )
              }

              tabStatus={tabStatusMap}
            />
          </Box>

          {/* FOOTER */}
          <DialogActions sx={{ justifyContent: "space-between", paddingX: 3 }}>
            {/* LEFT : BACK */}
            <MyButton
              variant="outlined"
              onClick={() => handleBack(activeTab, setActiveTab)}
              disabled={isFirstTab}
            >
              Back
            </MyButton>

            {/* CENTER */}
            <Stack direction="row" spacing={2}>
              <MyButton
                variant="success"
                onClick={() => handleNextOrRegister(activeTab, setActiveTab)}
              >
                {isAllTabsValid && isLastTab ? "Register" : "Save"}

              </MyButton>

              <MyButton
                variant="outlined"
                onClick={() =>
                  handleReset(
                    setActiveTab,
                    isDirty,
                    hasErrors,
                    () => handleConfirmOpen("reset")
                  )
                }
              >
                Reset
              </MyButton>
            </Stack>

            {/* RIGHT : NEXT */}
            <MyButton
              variant="contained"
              onClick={() => handleNext(activeTab, setActiveTab)}
              disabled={isLastTab}
            >
              Next
            </MyButton>
          </DialogActions>
        </MyDialog>

        {/* CONFIRM MODAL */}
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
              <MyButton variant="outlined" onClick={() => setShowConfirm(false)}>
                No
              </MyButton>
              <MyButton variant="contained" onClick={handleConfirmYes}>
                Yes
              </MyButton>
            </Stack>
          </DialogContent>
        </MyDialog>

        {/* SNACKBAR */}
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
