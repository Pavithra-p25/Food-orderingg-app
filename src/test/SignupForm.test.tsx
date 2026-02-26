import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi } from "vitest";
import { ErrorBoundary } from "react-error-boundary";
import { DialogSnackbarProvider } from "../context/DialogSnackbarContext";
import SignupForm from "../pages/authentication/SignupForm";

// Mock useUser hook
vi.mock("../hooks/useUser", () => ({
  default: () => ({
    fetchUsers: vi.fn().mockResolvedValue([]), // no existing users
    addUser: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe("SignupForm", () => {
  test("renders signup form", () => {
    const mockOnClose = vi.fn();

    render(
      <ErrorBoundary fallback={<div>Error</div>}>
        <DialogSnackbarProvider>
          <SignupForm onClose={mockOnClose} />
        </DialogSnackbarProvider>
      </ErrorBoundary>,
    );

    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test("signup button exists and is clickable", () => {
  const mockOnClose = vi.fn();

  render(
    <ErrorBoundary fallback={<div>Error</div>}>
      <DialogSnackbarProvider>
        <SignupForm onClose={mockOnClose} />
      </DialogSnackbarProvider>
    </ErrorBoundary>
  );

  // Find the button
  const signupButton = screen.getByRole("button", { name: /sign up/i });

  // Check that it exists and is enabled
  expect(signupButton).toBeInTheDocument();
  expect(signupButton).toBeEnabled();

  // Click it to ensure no crashes (optional, without asserting errors here)
  fireEvent.click(signupButton);
});

 test("shows validation errors when submitting empty form", async () => {
  const mockOnClose = vi.fn();

  render(
    <ErrorBoundary fallback={<div>Error</div>}>
      <DialogSnackbarProvider>
        <SignupForm onClose={mockOnClose} />
      </DialogSnackbarProvider>
    </ErrorBoundary>
  );

  const submitButton = screen.getByRole("button", { name: /sign up/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("Full name is required")).toBeInTheDocument();
    expect(screen.getByText("Email or Username is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByText("Confirm password is required")).toBeInTheDocument();
  });
});

  test("submits form successfully with valid data", async () => {
    const mockOnClose = vi.fn();

    render(
      <ErrorBoundary fallback={<div>Error</div>}>
        <DialogSnackbarProvider>
          <SignupForm onClose={mockOnClose} />
        </DialogSnackbarProvider>
      </ErrorBoundary>,
    );

    // Fill the form fields
    fireEvent.change(screen.getByPlaceholderText(/Enter your full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter email or username/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Create a password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Re-enter password/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(submitButton);

    // Wait for onClose to be called
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
