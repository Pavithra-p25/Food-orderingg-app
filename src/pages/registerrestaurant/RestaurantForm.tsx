
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container, Paper, Stack, Box, Typography} from "@mui/material";
import MyButton from "../../components/newcomponents/button/MyButton";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoginTab from "./LoginTab";
import RestaurantTab from "./RestaurantTab";
import ContactTab from "./ContactTab";
import LocationTab from "./LocationTab";
import MyTabs from "../../components/newcomponents/tabs/MyTab";
import { useSnackbar } from "../../context/SnackbarContext";
import { restaurantDefaultValues } from "../restaurant/data/restaurantDefaultValues";
import { restaurantSchema } from "../../schemas/restaurantSchema";
import type { Restaurant, RestaurantTabKey } from "../../types/RestaurantTypes";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";
import { useFormHandlers } from "../../hooks/restaurant/useFormHandlers";
import { isFieldFilled } from "../../utils/RestaurantFormUtils";
import useRestaurants from "../../hooks/restaurant/useRestaurant";
import type { CreateRestaurantDTO } from "../../hooks/restaurant/useRestaurant";
import { useNavigate, useParams } from "react-router-dom";
import DialogContent from "@mui/material/DialogContent";

const RestaurantForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [activeTab, setActiveTab] = useState<RestaurantTabKey>("login");
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<"register" | "reset" | "cancel" | null>(null);

  // Local state for the restaurant object being edited
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const { showSnackbar } = useSnackbar();
  const { addRestaurant, updateRestaurant, getRestaurantDetails } = useRestaurants();

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadData = async () => {
        const data = await getRestaurantDetails(id);
        if (data) {
          setRestaurant(data);
          methods.reset(data); // Reset form with fetched data
        } else {
          showSnackbar("Failed to load restaurant details", "error");
          navigate("/RestaurantSearch"); // Fallback
        }
      };
      loadData();
    }
  }, [id, isEditMode, getRestaurantDetails, showSnackbar, navigate]);

  const getCenterButtonLabel = () => {
    if (isEditMode) return "Update";
    return isAllTabsValid && isLastTab ? "Register" : "Save";
  };

  const methods = useForm<Restaurant>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(restaurantSchema),
    defaultValues: restaurantDefaultValues,
  });

  const {
    formState: { errors, isDirty },
    watch,
  } = methods;

  const watchedValues = watch();

  const TAB_FIELDS: Record<RestaurantTabKey, (keyof Restaurant)[]> = {
    login: ["email", "password", "confirmPassword"],
    restaurant: ["restaurantName", "restaurantType", "category"],
    contact: ["ownerName", "supportEmail", "phone"],
    location: ["address", "city", "state", "country", "pincode", "acceptTerms"],
    "Group by": [],
  };

  const tabOrder: RestaurantTabKey[] = ["login", "restaurant", "contact", "location"];

  const onSubmit = async (data: Restaurant) => {
    try {
      const finalData: Restaurant = {
        ...data,
        status: "active",
        isActive: true,
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode && id) {
        await updateRestaurant(id, finalData);
        showSnackbar(`"${data.restaurantName}" updated successfully`, "success");
      } else {
        const { id: _, isActive, createdAt, updatedAt, ...rest } = data;
        const createData: CreateRestaurantDTO = { ...rest };
        await addRestaurant({
          ...createData,
          status: "active",
        });
        showSnackbar("Restaurant registered successfully", "success");
      }

      setTimeout(() => {
        navigate(-1); // Go back
      }, 1500);
    } catch (error) {
      showSnackbar("Failed to save restaurant", "error");
    }
  };

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
        fields.every((field) => isFieldFilled(watchedValues[field])),
      ),
    onConfirmRegister: () => handleConfirmOpen("register"),
  });

  const tabStatusMap = Object.fromEntries(
    tabOrder.map((tab) => {
      const fields = TAB_FIELDS[tab];
      const hasError = fields.some((field) => errors[field]);
      if (hasError) return [tab, "error"];
      const allFilled = fields.every((field) => isFieldFilled(watchedValues[field]));
      return [tab, allFilled ? "success" : "neutral"];
    }),
  ) as Record<RestaurantTabKey, "neutral" | "error" | "success">;

  const isAllTabsValid = Object.values(tabStatusMap).every((status) => status === "success");
  const hasErrors = Object.keys(errors).length > 0;

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

  const handleSaveDraft = async () => {
    if (!isDirty) return;
    const values = methods.getValues();
    
    try {
      const draftId = values.id || Date.now().toString();
      const draft: Restaurant = {
        ...values,
        id: draftId,
        status: "draft",
        isActive: false,
        createdAt: values.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode && id) {
        await updateRestaurant(id, draft);
      } else {
       
        if (values.id && restaurant?.id) {
          await updateRestaurant(restaurant.id, draft);
        } else {
        
          const { id: _, ...rest } = draft;
          await addRestaurant(rest);
      
        }
      }
    } catch (e) {
      console.error(e);
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
 <Container
  maxWidth="lg"
  disableGutters
  sx={{ mt: 4, mb: 4, px: 2 }} // px: 1 or 2
>


      <Paper elevation={3} sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h5">
            {isEditMode ? "Edit Restaurant" : "Register Your Restaurant"}
          </Typography>
        </Box>

        <FormProvider {...methods}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ minHeight: 400, display: "flex", flexDirection: "column" ,  px: 3 }}>
              <MyTabs
                tabs={tabsData}
                activeTab={tabOrder.indexOf(activeTab)}
                onTabChange={(index) =>
                  handleTabChange(activeTab, tabOrder[index], setActiveTab)
                }
                tabStatus={tabStatusMap}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: "space-between", padding: 3, borderTop: 1, borderColor: 'divider' }}>
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
                    // If explicit "Update" or "Register" needed
                    if (isEditMode) {
                      await handleFinalSubmit();
                      return;
                    }

                    if (isAllTabsValid && isLastTab) {
                      handleConfirmOpen("register");
                      return;
                    }

                  
                    await handleSaveDraft();
                    handleNext(activeTab, setActiveTab);
                  }}
                >
                  {getCenterButtonLabel()}
                </MyButton>

                <MyButton
                  variant="outlined"
                  onClick={() =>
                    handleReset(setActiveTab, isDirty, hasErrors, () =>
                      handleConfirmOpen("reset"),
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
            </Box>
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
          </LocalizationProvider>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default RestaurantForm;


