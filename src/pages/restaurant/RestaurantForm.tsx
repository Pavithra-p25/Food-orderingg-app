import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, Box } from "@mui/material";
import MyButton from "../../components/newcomponents/button/MyButton";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoginTab from "./LoginTab";
import RestaurantTab from "./RestaurantTab";
import ContactTab from "./ContactTab";
import LocationTab from "./LocationTab";
import MyTabs from "../../components/newcomponents/tabs/MyTab";
import MySnackbar from "../../components/newcomponents/snackbar/MySnackbar";
import CloseIconButton from "../../components/newcomponents/button/CloseIconButton";
import { restaurantDefaultValues } from "./restaurantDefaultValues";
import { restaurantSchema } from "../../schemas/restaurantSchema";
import type { Restaurant, RestaurantTabKey } from "../../types/RestaurantTypes";

interface Props {
  show: boolean; // show or hide the dialog
  onClose: () => void; // to close the dialog
}

const RestaurantForm: React.FC<Props> = ({ show, onClose }) => {
  const [activeTab, setActiveTab] = useState<RestaurantTabKey>("login"); //which tab is currently active
  const [showConfirm, setShowConfirm] = useState(false); //confirm dialog is open or not
  const [actionType, setActionType] = useState<"register" | "reset" | "cancel" | null>(null); //which action is triggered
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
    formState: { errors }, //for tab error tracking
    watch, //check filled fields
  } = methods;
  const watchedValues = watch();


  const { handleSubmit, reset, trigger } = methods;

  // which fields belong to which tab - validation/tab status tracking
  const TAB_FIELDS: Record<RestaurantTabKey, (keyof Restaurant)[]> = {
    login: ["email", "password", "confirmPassword"],
    restaurant: ["restaurantName", "restaurantType", "category"],
    contact: ["ownerName", "supportEmail", "phone"],
    location: ["address", "city", "state", "country", "pincode"],
  };

  const getTabStatus = (tab: RestaurantTabKey): "neutral" | "error" | "success" => {
    const fields = TAB_FIELDS[tab];

    const hasError = fields.some((field) => errors[field]);
    if (hasError) return "error";

    const values = fields.map((field) => watchedValues[field]);

    const allFilled = values.every((val) => {
      if (val === undefined || val === null) return false;

      if (typeof val === "string") return val.trim() !== "";

      return true;
    });

    return allFilled ? "success" : "neutral";
  };

  //tab navigation order
  const tabOrder: RestaurantTabKey[] = ["login", "restaurant", "contact", "location"];

  const goNext = async () => {
    // Always trigger validation for current tab (to show errors)
    await trigger(TAB_FIELDS[activeTab]);

    // Always move to next tab
    const index = tabOrder.indexOf(activeTab);
    if (index < tabOrder.length - 1) {
      setActiveTab(tabOrder[index + 1]);
    }
  };

  const goBack = async () => {
    // Always trigger validation for current tab
    await trigger(TAB_FIELDS[activeTab]);

    // Always move to previous tab
    const index = tabOrder.indexOf(activeTab);
    if (index > 0) {
      setActiveTab(tabOrder[index - 1]);
    }
  };


  // SUBMIT function
  const onSubmit = (data: Restaurant) => {
    setSnackbar({
      open: true,
      message: "Restaurant registered successfully",
      severity: "success",
    });
    console.log("Submitted Data:", data);
  };

  // CONFIRMATION
  const handleConfirmOpen = (type: "register" | "reset" | "cancel") => {
    setActionType(type);
    setShowConfirm(true);
  };

  const handleConfirmYes = async () => {
    if (actionType === "register") {
      if (activeTab === "location") {//if in last tab, validate all fields and submit , else validate current tab and go next
        const isValid = await trigger(); // validate all fields before submit
        if (!isValid) {
          setShowConfirm(false);
          return;
        }
        handleSubmit((data) => {
          onSubmit(data); // Toast will show here
          setShowConfirm(false);
        })();
        return;
      }

      // validate only current tab fields
      const isValid = await trigger(TAB_FIELDS[activeTab]);
      if (!isValid) {
        setShowConfirm(false);
        return;
      }

      goNext();
      setShowConfirm(false);
      return;
    }

    if (actionType === "reset") {
      reset(); // reset the form fields
      setSnackbar({
        open: true,
        message: "Form reset successfully",
        severity: "info",
      });
      setActiveTab("login"); // go back to first tab
      setShowConfirm(false);
      return;
    }

    if (actionType === "cancel") {
      onClose();
      setShowConfirm(false);
    }
  };

  // for tab status 
  const tabStatusMap = {
    login: getTabStatus("login"),
    restaurant: getTabStatus("restaurant"),
    contact: getTabStatus("contact"),
    location: getTabStatus("location"),
  };

  const isAllTabsValid = Object.values(tabStatusMap).every(
    (status) => status === "success"
  );

  const tabsData = [
    { key: "login", tabName: "Login Details", tabContent: <LoginTab /> },
    { key: "restaurant", tabName: "Restaurant Details", tabContent: <RestaurantTab /> },
    { key: "contact", tabName: "Contact Info", tabContent: <ContactTab /> },
    { key: "location", tabName: "Location Details", tabContent: <LocationTab /> },
  ];

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* MAIN FORM MODAL */}
        <Dialog open={show} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{
              textAlign: "center",
              position: "relative",
            }}
          >
            Register Your Restaurant

            <Box
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <CloseIconButton onClick={onClose} />
            </Box>
          </DialogTitle>


          <DialogContent>
            {/* Fixed height tab container */}
            <Box sx={{ minHeight: 400, display: "flex", flexDirection: "column" }}>
              <MyTabs
                tabs={tabsData}
                activeTab={tabOrder.indexOf(activeTab)}
                onTabChange={(index) => setActiveTab(tabOrder[index])}
                tabStatus={tabStatusMap}
              />

            </Box>
          </DialogContent>

          {/* FOOTER */}
          <DialogActions sx={{ justifyContent: "space-between", paddingX: 3 }}>
            {/* LEFT : BACK */}
            <MyButton
              variant="outlined"
              onClick={goBack}
              disabled={activeTab === "login"}
            >
              Back
            </MyButton>

            {/* CENTER */}
            <Stack direction="row" spacing={2}>
              <MyButton
                variant="success"
                onClick={async () => {
                  // Always trigger validation for current tab
                  await trigger(TAB_FIELDS[activeTab]);

                  // If NOT last tab → just move forward (NO confirmation)
                  if (activeTab !== "location") {
                    goNext();
                    return;
                  }

                  // Last tab + all tabs valid → ask confirmation
                  if (isAllTabsValid) {
                    handleConfirmOpen("register");
                  }
                }}
              >
                {isAllTabsValid && activeTab === "location" ? "Register" : "Save"}
              </MyButton>

              <MyButton
                variant="outlined"

                onClick={() => handleConfirmOpen("reset")}
              >
                Reset
              </MyButton>
            </Stack>

            {/* RIGHT : NEXT */}
            <MyButton
              variant="contained"
              onClick={goNext}
              disabled={activeTab === "location"}
            >
              Next
            </MyButton>
          </DialogActions>
        </Dialog>

        {/* CONFIRM MODAL */}
        <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} maxWidth="xs" fullWidth>
          <DialogContent sx={{ textAlign: "center" }}>
            {actionType === "register"
              ? "Proceed with restaurant registration?"
              : "Are you sure?"}
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <MyButton
                variant="outlined"
                onClick={() => setShowConfirm(false)}
              >
                No
              </MyButton>
              <MyButton
                variant="contained"
                onClick={handleConfirmYes}
              >
                Yes
              </MyButton>
            </Stack>
          </DialogContent>
        </Dialog>

        {/* SNACKBAR */}
        <MySnackbar
          open={snackbar.open} //true or false
          message={snackbar.message}
          severity={snackbar.severity} // "success" | "error" ..
          onClose={() => setSnackbar({ ...snackbar, open: false })} //handle close
        />
      </LocalizationProvider>
    </FormProvider>
  );
};

export default RestaurantForm;
