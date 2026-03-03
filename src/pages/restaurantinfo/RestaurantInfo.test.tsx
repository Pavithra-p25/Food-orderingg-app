import { render, screen, fireEvent } from "../../test/customRender";
import { describe, test, expect, vi, beforeEach } from "vitest";
import RestaurantInfo from "./RestaurantInfo";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

// MOCKS 
const mockShowSnackbar = vi.fn();

vi.mock("../../context/DialogSnackbarContext", () => ({
  useDialogSnackbar: () => ({
    showSnackbar: mockShowSnackbar,
  }),
  DialogSnackbarProvider: ({ children }: any) => children,
}));

const mockAddRestaurantInfo = vi.fn();
const mockFetchRestaurantInfo = vi.fn();

vi.mock("../../hooks/restaurantinfo/useRestaurantInfo", () => ({
  useRestaurantInfo: () => ({
    restaurantInfoList: [],
    addRestaurantInfo: mockAddRestaurantInfo,
    editRestaurantInfo: vi.fn(),
    fetchRestaurantInfo: mockFetchRestaurantInfo,
  }),
}));

// TESTS 

describe("RestaurantInfo Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("expand all button toggles correctly", async () => {
    render(
      <MemoryRouter>
        <RestaurantInfo />
      </MemoryRouter>
    );

    const expandButton = screen.getByLabelText(/expand all forms/i);
    expect(expandButton).toBeInTheDocument();

    fireEvent.click(expandButton);

    const collapseButton = await screen.findByLabelText(/collapse all forms/i);
    expect(collapseButton).toBeInTheDocument();

    fireEvent.click(collapseButton);

    const expandAgain = await screen.findByLabelText(/expand all forms/i);
    expect(expandAgain).toBeInTheDocument();
  });

  test("shows no changes made snackbar when reset clicked without changes", () => {
    render(
      <MemoryRouter>
        <RestaurantInfo />
      </MemoryRouter>
    );

    //  Click Reset button
    const resetButton = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetButton);

    //  Expect snackbar called
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "No changes made",
      "info" 
    );
  });

test("resets form and shows form resetted snackbar when form have changes", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <RestaurantInfo />
    </MemoryRouter>
  );

  const nameInput = screen.getByLabelText(/restaurant name/i);

  // existing value 
  await user.clear(nameInput);

  await user.type(nameInput, "New Restaurant Name");

  const resetButton = screen.getByRole("button", { name: /reset/i });

  await user.click(resetButton);

  await waitFor(() => {
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "Changes reverted",
      "success"
    );
  });
});

test("shows validation errors when submitting empty required fields", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <RestaurantInfo />
    </MemoryRouter>
  );

  //  Click Submit without filling anything
  const submitButton = screen.getByRole("button", { name: /submit/i });
  await user.click(submitButton);

  // Wait for validation errors to appear
  await waitFor(() => {
    expect(screen.getByText(/restaurant name is required/i)).toBeInTheDocument();
  });

  // Ensure form was NOT submitted
  expect(mockShowSnackbar).not.toHaveBeenCalledWith(
    "Form submitted successfully!",
    "success"
  );
});
});