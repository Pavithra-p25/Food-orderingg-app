import * as React from "react";
import { useFieldArray } from "react-hook-form";
import type {
  Control,
  UseFormTrigger,
} from "react-hook-form";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import { MAX_MENU_ITEMS, canAddItem } from "../config/constants/RestaurantConstant";
import { useState } from "react";


/*  RESTAURANT ACCORDION HANDLERS */
export const useRestaurantAccordionHandlers = (
  control: Control<RestaurantInfoValues>,
  trigger: UseFormTrigger<RestaurantInfoValues>,
   isEditMode: boolean,
) => {
  /*  MENU ITEMS  */
  const menuItemsArray = useFieldArray({
    control,
    name: "menuItems",
  });

const [menuEditable, setMenuEditable] = useState<boolean[]>(
  menuItemsArray.fields.map(() => !isEditMode),
);

React.useEffect(() => {
  setMenuEditable(
    menuItemsArray.fields.map(() => !isEditMode),
  );
}, [menuItemsArray.fields.length, isEditMode]);



  const addMenuItem = async () => {
    if (!canAddItem(menuItemsArray.fields.length, MAX_MENU_ITEMS)) return;

    const valid = await trigger("menuItems");
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

 const saveMenuItem = async (index: number) => {
  const valid = await trigger([
    `menuItems.${index}.itemName`,
    `menuItems.${index}.category`,
    `menuItems.${index}.price`,
  ]);

  if (valid) {
    setMenuEditable((prev) => prev.map((v, i) => (i === index ? false : v)));
    // Optional: you can remove the `: v` part if you want others to stay as is
  }
};

const editMenuItem = (index: number) => {
  setMenuEditable((prev) => {
    const newState = [...prev];
    newState[index] = true;
    return newState;
  });
};

  const removeMenuItem = (index: number) => {
    menuItemsArray.remove(index);
    setMenuEditable((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  return {
    /* menu */
    menuItemsArray,
    menuEditable,
    addMenuItem,
    saveMenuItem,
    editMenuItem,
    removeMenuItem,
  };
};
