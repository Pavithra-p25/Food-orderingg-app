import * as React from "react";
import { useFieldArray } from "react-hook-form";
import type {
  Control,
  UseFormTrigger,
} from "react-hook-form";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";

/*  RESTAURANT ACCORDION HANDLERS */
export const useRestaurantAccordionHandlers = (
  control: Control<RestaurantInfoValues>,
  trigger: UseFormTrigger<RestaurantInfoValues>,
) => {
  /*  MENU ITEMS  */
  const menuItemsArray = useFieldArray({
    control,
    name: "menuItems",
  });

  const [menuEditable, setMenuEditable] = React.useState<boolean[]>(
    menuItemsArray.fields.map(() => true),
  );

  const addMenuItem = async () => {
    if (menuItemsArray.fields.length >= 3) return;

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
      setMenuEditable((prev) =>
        prev.map((v, i) => (i === index ? false : v)),
      );
    }
  };

  const editMenuItem = (index: number) => {
    setMenuEditable((prev) =>
      prev.map((v, i) => (i === index ? true : v)),
    );
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
