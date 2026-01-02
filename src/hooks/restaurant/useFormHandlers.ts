import type { Restaurant, RestaurantTabKey } from "../../types/RestaurantTypes";

type UseFormHandlersProps = {
  form: any; // react-hook-form methods
  tabOrder: RestaurantTabKey[];
  tabFields: Record<RestaurantTabKey, (keyof Restaurant)[]>;
  onFinalSubmit: (data: Restaurant) => void;
  getIsAllTabsValid?: () => boolean; // optional, used for final submit check
  onConfirmRegister?: () => void; // optional callback to open register confirmation
};

export function useFormHandlers({
  form,
  tabOrder,
  tabFields,
  onFinalSubmit,
  getIsAllTabsValid,
  onConfirmRegister,
}: UseFormHandlersProps) {
  const { trigger, reset, handleSubmit } = form;

  //  ACTIONS
  const handleNext = async (
    activeTab: RestaurantTabKey,
    setActiveTab: (tab: RestaurantTabKey) => void
  ) => {
    await trigger(tabFields[activeTab]);
    const index = tabOrder.indexOf(activeTab);
    if (index < tabOrder.length - 1) {
      setActiveTab(tabOrder[index + 1]);
    }
  };

  const handleBack = async (
    activeTab: RestaurantTabKey,
    setActiveTab: (tab: RestaurantTabKey) => void
  ) => {
    await trigger(tabFields[activeTab]);
    const index = tabOrder.indexOf(activeTab);
    if (index > 0) {
      setActiveTab(tabOrder[index - 1]);
    }
  };

  const handleSave = async (activeTab: RestaurantTabKey) => {
    await trigger(tabFields[activeTab]);
    // draft save API later
  };

  const handleUpdate = async () => {
    await trigger();
    // update API later
  };

  const handleFinalSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    handleSubmit((data: Restaurant) => {
      onFinalSubmit(data);
    })();
  };

  const handleReset = (
    setActiveTab: (tab: RestaurantTabKey) => void,
    isDirty: boolean,
    hasErrors: boolean,
    onConfirm: () => void
  ) => {
    if (isDirty || hasErrors) {
      onConfirm();
      return;
    }
    reset();
    setActiveTab("login");
  };

  // handler for center button (Save / Register)
  const handleNextOrRegister = async (
    activeTab: RestaurantTabKey,
    setActiveTab: (tab: RestaurantTabKey) => void
  ) => {
    await trigger(tabFields[activeTab]);
    const index = tabOrder.indexOf(activeTab);

    // intermediate tabs → go to next
    if (index < tabOrder.length - 1) {
      setActiveTab(tabOrder[index + 1]);
      return;
    }

    // last tab → trigger final submit
    if (getIsAllTabsValid && getIsAllTabsValid() && onConfirmRegister) {
      onConfirmRegister();
    }
  };

    const handleTabChange = async (
    fromTab: RestaurantTabKey,
    toTab: RestaurantTabKey,
    setActiveTab: (tab: RestaurantTabKey) => void
  ) => {
    // trigger validation for current tab
    await trigger(tabFields[fromTab]);

    // allow navigation (errors will now appear)
    setActiveTab(toTab);
  };

  return {
    handleNext,
    handleBack,
    handleSave,
    handleUpdate,
    handleFinalSubmit,
    handleReset,
    handleNextOrRegister,
    handleTabChange,
  };
}
