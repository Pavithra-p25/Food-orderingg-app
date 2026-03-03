import { renderHook, act } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { useRestaurantAccordionHandlers } from "./restaurantinfo/useRestaurantHandlers";
import type { RestaurantInfoValues } from "../types/RestaurantInfoTypes";
import { vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { MAX_MENU_ITEMS } from "../config/constants/RestaurantConstant"; // adjust relative path

// ---------- ADD MENU ITEM ----------
it("should add a new menu item if the first item is valid", async () => {
  const { hookResult } = renderHookWithTrigger(true);

  // Call the async function directly
  await hookResult.result.current.addMenuItem();

  // Wait for the state to update and assert
  await waitFor(() => {
    expect(hookResult.result.current.menuItemsArray.fields.length).toBe(2);
    expect(hookResult.result.current.menuEditable[1]).toBe(true);
  });
});

// Mock canAddItem to avoid real logic during tests
vi.mock("../utils/canAddItem", () => ({
  canAddItem: vi.fn(() => true),
}));

// HELPER FUNCTION
const renderWithForm = (overrides?: Partial<RestaurantInfoValues>) => {
  const defaultValues: RestaurantInfoValues = {
    restaurantName: "Test Restaurant",
    ownerName: "Test Owner",
    branches: [
      {
        branchName: "Main Branch",
        branchCode: "AS78779",
        complianceDetails: [
          {
            licenseType: "Fssai",
            licenseNumber: "1234567890",
            validFrom: "2020-01-01",
            validTill: "2026-12-31",
          },
        ],
      },
    ],
    menuItems: [{ itemName: "", category: "", price: 0, file: null }],
    ...overrides,
  };

  let triggerSpy: any;

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<RestaurantInfoValues>({ defaultValues });
    triggerSpy = vi.spyOn(methods, "trigger");
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  const hookResult = renderHook(
    () => useRestaurantAccordionHandlers(wrapper({ children: null }).props.control, triggerSpy, false),
    { wrapper }
  );

  return { hookResult, triggerSpy };
};

const renderHookWithTrigger = (triggerResult: boolean, overrides?: Partial<RestaurantInfoValues>) => {
  const { hookResult, triggerSpy } = renderWithForm(overrides);
  triggerSpy.mockResolvedValue(triggerResult);
  return { hookResult, triggerSpy };
};

//  TEST 
describe("useRestaurantAccordionHandlers", () => {

  // ADD MENU ITEM 
 it("should not add a menu item if the first item is invalid", async () => {
  const { hookResult } = renderHookWithTrigger(false); // trigger returns false

  await hookResult.result.current.addMenuItem();

  // Wait for state update
  await waitFor(() => {
    expect(hookResult.result.current.menuItemsArray.fields.length).toBe(1); 
  });
});

  //  SAVE MENU ITEM 
  it("should not save an invalid menu item", async () => {
    const { hookResult, triggerSpy } = renderWithForm();
    triggerSpy.mockResolvedValue(false);

    await act(async () => {
      await hookResult.result.current.saveMenuItem(0);
    });

    expect(triggerSpy).toHaveBeenCalledWith([
      "menuItems.0.itemName",
      "menuItems.0.category",
      "menuItems.0.price",
    ]);
    expect(hookResult.result.current.menuEditable[0]).toBe(true);
  });

  it("should save a valid menu item and make it non-editable", async () => {
  const { hookResult } = renderHookWithTrigger(true, {
    menuItems: [{ itemName: "Pizza", category: "South Indian", price: 10, file: null }],
  });

  await act(async () => {
    await hookResult.result.current.saveMenuItem(0);
  });

  expect(hookResult.result.current.menuEditable[0]).toBe(false);
});

  //  EDIT MENU ITEM 
  it("should make a saved menu item editable again", () => {
    const { hookResult } = renderWithForm({
      menuItems: [{ itemName: "Burger", category: "North Indian", price: 12, file: null }],
    });

    act(() => {
      hookResult.result.current.editMenuItem(0);
    });

    expect(hookResult.result.current.menuEditable[0]).toBe(true);
  });

  it("should not save if only some fields are invalid", async () => {
  const { hookResult, triggerSpy } = renderWithForm({
    menuItems: [{ itemName: "A", category: "", price: 5, file: null }],
  });

  triggerSpy.mockResolvedValue(false);

  await hookResult.result.current.saveMenuItem(0);

  expect(hookResult.result.current.menuEditable[0]).toBe(true);
});

  //  REMOVE MENU ITEM 
  it("should remove the only menu item and empty the menu", () => {
    const { hookResult } = renderWithForm({
      menuItems: [{ itemName: "Solo Item", category: "Cat Solo", price: 50, file: null }],
    });

    act(() => {
      hookResult.result.current.removeMenuItem(0);
    });

    expect(hookResult.result.current.menuItemsArray.fields.length).toBe(0);
    expect(hookResult.result.current.menuEditable.length).toBe(0);
  });

  it("should remove the second menu item and keep the first", () => {
    const { hookResult } = renderWithForm({
      menuItems: [
        { itemName: "Item 1", category: "Cat 1", price: 10, file: null },
        { itemName: "Item 2", category: "Cat 2", price: 20, file: null },
      ],
    });

    act(() => {
      hookResult.result.current.removeMenuItem(1);
    });

    expect(hookResult.result.current.menuItemsArray.fields.length).toBe(1);
    expect(hookResult.result.current.menuItemsArray.fields[0].itemName).toBe("Item 1");
    expect(hookResult.result.current.menuEditable.length).toBe(1);
  });

  it("should not add a new menu item if MAX_MENU_ITEMS is reached", async () => {
  const maxItems = Array.from({ length: MAX_MENU_ITEMS }, (_, i) => ({
    itemName: `Item ${i + 1}`,
    category: `Cat ${i + 1}`,
    price: i + 1,
    file: null,
  }));

  const { hookResult } = renderHookWithTrigger(true, { menuItems: maxItems });

  await hookResult.result.current.addMenuItem();

  await waitFor(() => {
    expect(hookResult.result.current.menuItemsArray.fields.length).toBe(MAX_MENU_ITEMS);
  });
});
});