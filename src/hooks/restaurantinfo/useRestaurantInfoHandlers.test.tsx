import { renderHook, act } from "@testing-library/react";
import { useRestaurantInfoHandlers } from "./useRestaurantInfoHandlers";
import { useRestaurantInfo } from "./useRestaurantInfo";
import { useDialogSnackbar } from "../../context/DialogSnackbarContext";
import { useNavigate } from "react-router-dom";
import { defaultRestaurantValues } from "../../pages/restaurantinfo/data/RestaurantInfoDefault";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import { vi, type Mock } from "vitest";
import type { UseFormReset } from "react-hook-form";

//  MOCKS 
vi.mock("./useRestaurantInfo", () => ({
  useRestaurantInfo: vi.fn(),
}));

vi.mock("../../context/DialogSnackbarContext", () => ({
  useDialogSnackbar: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

//  TEST DATA 
const mockInitialData: RestaurantInfoValues = {
  id: "123",
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
  menuItems: [
    {
      itemName: "Test Item",
      category: "Test Category",
      price: 100,
      file: null,
    },
  ],
};

describe("useRestaurantInfoHandlers", () => {
  let addRestaurantInfo: Mock;
  let fetchRestaurantInfo: Mock;
  let editRestaurantInfo: Mock;
  let showSnackbar: Mock;
  let navigate: Mock;
  let reset: UseFormReset<RestaurantInfoValues>;

  // render function
  const renderHookWithDefaults = (
    options?: Partial<Parameters<typeof useRestaurantInfoHandlers>[0]>
  ) => {
    return renderHook(() =>
      useRestaurantInfoHandlers({
        reset,
        formState: { dirtyFields: {} } as any,
        branchCount: 0,
        ...options,
      })
    );
  };

  beforeEach(() => {
    addRestaurantInfo = vi.fn().mockResolvedValue(undefined);
    fetchRestaurantInfo = vi.fn().mockResolvedValue(undefined);
    editRestaurantInfo = vi.fn().mockResolvedValue(undefined);
    showSnackbar = vi.fn();
    reset = vi.fn();
    navigate = vi.fn();

    (useRestaurantInfo as Mock).mockReturnValue({
      addRestaurantInfo,
      fetchRestaurantInfo,
      editRestaurantInfo,
    });

    (useDialogSnackbar as Mock).mockReturnValue({
      showSnackbar,
    });

    (useNavigate as Mock).mockReturnValue(navigate);
  });

  //  STATE TESTS 
  it("initializes state correctly", () => {
    const { result } = renderHookWithDefaults({ branchCount: 2 });

    expect(result.current.expandedRestaurant).toBe(true);
    expect(result.current.expandedBranches).toEqual([]);
    expect(result.current.expandAll).toBe(false);
  });

  it("adds branch index when handleBranchAdded is called", () => {
    const { result } = renderHookWithDefaults({ branchCount: 2 });

    act(() => result.current.handleBranchAdded(1));
    expect(result.current.expandedBranches).toEqual([1]);
  });

  it("toggles expand all correctly", () => {
    const { result } = renderHookWithDefaults({ branchCount: 3 });

    act(() => result.current.handleToggleExpandAll());

    expect(result.current.expandAll).toBe(true);
    expect(result.current.expandedRestaurant).toBe(true);
    expect(result.current.expandedBranches).toEqual([0, 1, 2]);

    act(() => result.current.handleToggleExpandAll());

    expect(result.current.expandAll).toBe(false);
    expect(result.current.expandedRestaurant).toBe(false);
    expect(result.current.expandedBranches).toEqual([]);
  });

  //  SUBMIT TESTS 
  describe("handleSubmitForm", () => {
    it("submits form successfully", async () => {
      const { result } = renderHookWithDefaults();

      await act(async () => {
        await result.current.handleSubmitForm(mockInitialData);
      });

      expect(addRestaurantInfo).toHaveBeenCalledWith(mockInitialData);
      expect(fetchRestaurantInfo).toHaveBeenCalled();
      expect(showSnackbar).toHaveBeenCalledWith(
        "Form submitted successfully!",
        "success"
      );
      expect(reset).toHaveBeenCalledWith(defaultRestaurantValues);
    });

    it("shows error on submission failure", async () => {
      addRestaurantInfo.mockRejectedValueOnce(new Error("fail"));
      const { result } = renderHookWithDefaults();

      await act(async () => {
        await result.current.handleSubmitForm(mockInitialData);
      });

      expect(showSnackbar).toHaveBeenCalledWith(
        "Submission failed!",
        "error"
      );
    });
  });

  // UPDATE TESTS 
  describe("handleUpdateForm", () => {
    it("shows error if ID missing", async () => {
      const { result } = renderHookWithDefaults();

      await act(async () => {
        await result.current.handleUpdateForm({
          ...mockInitialData,
          id: undefined,
        });
      });

      expect(showSnackbar).toHaveBeenCalledWith(
        "Missing restaurant ID",
        "error"
      );
    });

    it("updates restaurant and navigates", async () => {
      const { result } = renderHookWithDefaults({
        initialData: mockInitialData,
      });

      await act(async () => {
        await result.current.handleUpdateForm(mockInitialData);
      });

      expect(editRestaurantInfo).toHaveBeenCalledWith(
        "123",
        mockInitialData
      );
      expect(showSnackbar).toHaveBeenCalledWith(
        "Restaurant updated successfully",
        "success"
      );
      expect(navigate).toHaveBeenCalledWith("/RestaurantInfoList");
    });

    it("shows error on update failure", async () => {
      editRestaurantInfo.mockRejectedValueOnce(new Error("fail"));

      const { result } = renderHookWithDefaults({
        initialData: mockInitialData,
      });

      await act(async () => {
        await result.current.handleUpdateForm(mockInitialData);
      });

      expect(showSnackbar).toHaveBeenCalledWith(
        "Update failed!",
        "error"
      );
    });
  });
});