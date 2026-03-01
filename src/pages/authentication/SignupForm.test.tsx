import { render, screen, fireEvent, waitFor } from "../../test/customRender";
//render - Renders  React component
//screen - Lets query elements from rendered component.
//fireEvent -  user actions clicking/typing.
//waitFor - Waits for async updates (like validation msgs
import { describe, test, vi } from "vitest";
//describe - Group related tests, test - Define individual test cases, vi - Vitest's mocking
import SignupForm from "./SignupForm";
import useUser from "../../hooks/useUser";

// Mock useUser hook , fake implementation for testing without real API calls
vi.mock("../../hooks/useUser", () => ({
  default: vi.fn(),
}));

const mockedUseUser = vi.mocked(useUser);
beforeEach(() => {
  mockedUseUser.mockReturnValue({
    fetchUsers: vi.fn().mockResolvedValue([]),
    addUser: vi.fn().mockResolvedValue(undefined),
  });
});

describe("SignupForm", () => {
  test("renders signup form", () => {
    const mockOnClose = vi.fn(); //Creates a mock function to simulate closing the form.

    render(<SignupForm onClose={mockOnClose} />);

    expect(screen.getByText(/sign up/i)).toBeInTheDocument(); //Checks  text Sign Up is on screen.
  });

  test("signup button exists and is clickable", () => {
    const mockOnClose = vi.fn();

    render(<SignupForm onClose={mockOnClose} />);

    // Find the button
    const signupButton = screen.getByRole("button", { name: /sign up/i });

    // Check that it exists and is enabled
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).toBeEnabled();

    //Clicks button to ensure clicking doesn’t crash the form.
    fireEvent.click(signupButton);
  });

  test("shows validation errors when submitting empty form", async () => {
    const mockOnClose = vi.fn();

    render(<SignupForm onClose={mockOnClose} />);

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeInTheDocument();
      expect(
        screen.getByText("Email or Username is required"),
      ).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(
        screen.getByText("Confirm password is required"),
      ).toBeInTheDocument();
    });
  });

  test("submits form successfully and shows success snackbar", async () => {
  const mockOnClose = vi.fn();

  const mockAddUser = vi.fn().mockResolvedValue(undefined);

  mockedUseUser.mockReturnValue({
    fetchUsers: vi.fn().mockResolvedValue([]),
    addUser: mockAddUser,
  });

  render(<SignupForm onClose={mockOnClose} />);

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

  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  //  Check addUser called
  await waitFor(() => {
    expect(mockAddUser).toHaveBeenCalled();
  });

  //  Check success snackbar text
  expect(
    await screen.findByText(/signup successful/i)
  ).toBeInTheDocument();

  // Check form closed
  expect(mockOnClose).toHaveBeenCalled();
});

  test("shows error and prevents signup if user already exists", async () => {
    const mockOnClose = vi.fn();

    const mockFetchUsers = vi
      .fn()
      .mockResolvedValue([{ emailOrUsername: "john@example.com" }]);
    const mockAddUser = vi.fn();

   mockedUseUser.mockReturnValue({

      fetchUsers: mockFetchUsers,
      addUser: mockAddUser,
    });

    render(<SignupForm onClose={mockOnClose} />);

    // Fill form with existing email
    fireEvent.change(screen.getByPlaceholderText(/Enter your full name/i), {
      target: { value: "John Doe" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter email or username/i), {
      target: { value: "john@example.com" }, // same email
    });

    fireEvent.change(screen.getByPlaceholderText(/Create a password/i), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Re-enter password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    //  Error message appears
    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();

    //  addUser was NOT called
    expect(mockAddUser).not.toHaveBeenCalled();

    //  Form did NOT close
    expect(mockOnClose).not.toHaveBeenCalled();
  });

});
