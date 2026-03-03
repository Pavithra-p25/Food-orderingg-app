import { render, screen, waitFor } from "../../test/customRender";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import RestaurantForm from "./RestaurantForm";

// -------------------- MOCKS --------------------

// Dialog & Snackbar context
vi.mock("../../context/DialogSnackbarContext", () => ({
  useDialogSnackbar: () => ({
    showSnackbar: vi.fn(),
    showDialog: vi.fn(),
  }),
  DialogSnackbarProvider: ({ children }: any) => <>{children}</>,
}));

// Restaurants hook
vi.mock("../../hooks/restaurant/useRestaurant", () => ({
  default: () => ({
    addRestaurant: vi.fn(),
    updateRestaurant: vi.fn(),
    getRestaurantDetails: vi.fn(),
  }),
}));

// Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}), // not in edit mode
  };
});

// -------------------- TEST --------------------

describe("RestaurantForm Navigation Buttons & Validation", () => {
  test("Back is disabled on first tab, Next is enabled", () => {
    render(<RestaurantForm />);

    const backButton = screen.getByRole("button", { name: /Back/i });
    const nextButton = screen.getByRole("button", { name: /Next/i });
    const centerButton = screen.getByRole("button", { name: /Save/i });

    expect(backButton).toBeDisabled();
    expect(centerButton).toBeEnabled();
    expect(nextButton).toBeEnabled();
  });

  test("Next is disabled on last tab, Back is enabled", async () => {
    const user = userEvent.setup();
    render(<RestaurantForm />);

    // Click the last tab (Location Details)
    const lastTab = screen.getByRole("tab", { name: /Location Details/i });
    await user.click(lastTab);

    const backButton = screen.getByRole("button", { name: /Back/i });
    const nextButton = screen.getByRole("button", { name: /Next/i });
    const centerButton = screen.getByRole("button", { name: /Save|Register|Update/i });

    expect(backButton).toBeEnabled();
    expect(nextButton).toBeDisabled();
    expect(centerButton).toBeEnabled();
  });

  test("Clicking Next on first tab without required fields shows validation errors", async () => {
    const user = userEvent.setup();
    render(<RestaurantForm />);

    // Ensure we are on first tab
    expect(screen.getByRole("tab", { name: /Login Details/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // Click Next without filling fields
    const nextButton = screen.getByRole("button", { name: /Next/i });
    await user.click(nextButton);

    // Validation errors should appear
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument();
    });

    // First tab should still be active
    expect(screen.getByRole("tab", { name: /Login Details/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  test("Reset on a new/unchanged form does not show a confirmation dialog", async () => {
  const user = userEvent.setup();
  render(<RestaurantForm />);

  // Get the Reset button
  const resetButton = screen.getByRole("button", { name: /Reset/i });

  // Click Reset
  await user.click(resetButton);

  // Since form is pristine, the dialog should NOT appear
  const confirmDialog = screen.queryByText(/Are you sure you want to reset/i);
  expect(confirmDialog).not.toBeInTheDocument();
});


});