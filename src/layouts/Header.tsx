import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { ThemeContext } from "../context/ThemeContext";
import "../components/Button/Button.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/theme.css";
import "../styles/sidebar.css";
import "./header.css";
import LoginForm from "../pages/authentication/LoginForm";
import SignupForm from "../pages/authentication/SignupForm";
import MyToast from "../components/toast/MyToast";

type FoodMode = "veg" | "nonveg" | null;

interface HeaderState {
  showLoginForm: boolean;
  showSignupForm: boolean;
  collapsed: boolean;
  foodMode: FoodMode;
  user: any | null;
  toastMessage: string; // for MyToast
  showToast: boolean;
}

const Header: React.FC = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  // single state object
  const [state, setState] = useState<HeaderState>({
    showLoginForm: false,
    showSignupForm: false,
    collapsed: true,
    foodMode: null,
    user: null,
    toastMessage: "",
    showToast: false,
  });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser)
      setState((prev) => ({ ...prev, user: JSON.parse(storedUser) }));
  }, []);

  // Dark mode effect
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // Veg/Non-Veg toggle buttons
  const FoodToggle = (
    <div
      className="btn-group w-100" // full width in container
      style={{ maxWidth: "220px" }} // optional max width for larger screens
    >
      <Button
        variant={state.foodMode === "veg" ? "success" : "outline-success"}
        onClick={() =>
          setState((prev) => ({
            ...prev,
            foodMode: prev.foodMode === "veg" ? null : "veg",
          }))
        }
        style={{ flex: 1, whiteSpace: "nowrap" }}
      >
        Veg
      </Button>
      <Button
        variant={state.foodMode === "nonveg" ? "danger" : "outline-danger"}
        onClick={() =>
          setState((prev) => ({
            ...prev,
            foodMode: prev.foodMode === "nonveg" ? null : "nonveg",
          }))
        }
        style={{ flex: 1, whiteSpace: "nowrap" }}
      >
        Non-Veg
      </Button>
    </div>
  );

  // Dark Mode toggle
  const DarkToggle = (
    <div className="d-flex align-items-center gap-1 ms-2">
      <span style={{ color: darkMode ? "white" : "black" }}>Dark</span>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>
    </div>
  );

  // Person section
  const PersonSection = () => {
    if (state.user) {
      // Logged-in user: show dropdown
      return (
        <Dropdown align="end">
          <Dropdown.Toggle
            as="div"
            id="dropdown-person"
            className="d-flex align-items-center"
          >
            <i
              className="bi bi-person-circle fs-5"
              style={{ cursor: "pointer" }}
            ></i>{" "}
            <span className="username ms-1">{state.user.fullName}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => alert("Go to profile page")}>
              <i className="bi bi-person-lines-fill me-2"></i>My Profile
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                localStorage.removeItem("user");
                setState((prev) => ({
                  ...prev,
                  user: null,
                  showToast: true,
                  toastMessage: "Logged out successfully",
                }));
              }}
            >
              {" "}
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    } else {
      // Not logged in: show icon with "Login" text
      return (
        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => setState((prev) => ({ ...prev, showLoginForm: true }))}
        >
          <i className="bi bi-person-circle fs-5"></i>
          <span className="ms-1">Login</span>
        </div>
      );
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar
        expand="lg"
        bg={darkMode ? "dark" : "light"}
        variant={darkMode ? "dark" : "light"}
        className="shadow-sm px-3 fixed-top"
      >
        <Container fluid className="px-2 position-relative">
          {/* Left section */}
          <div className="header-left">
            <Button
              style={{ marginLeft: "-8px" }}
              variant="outline-secondary"
              onClick={() =>
                setState((prev) => ({ ...prev, collapsed: !prev.collapsed }))
              }
            >
              <i className="bi bi-list"></i>
            </Button>
          </div>

          {/* App title */}
          <div className="header-title">
            <Navbar.Brand
              href="#"
              className="fw-bold fs-4"
              style={{ color: darkMode ? "white" : "#e23744" }}
            >
              FoodExpress
            </Navbar.Brand>
          </div>

          {/* Right section */}
          <div className="header-right d-none d-lg-flex">
            {DarkToggle}
            {FoodToggle}
            <PersonSection />
          </div>

          {/* Mobile right section */}
          <div className="header-right d-flex d-lg-none">
            <PersonSection />
          </div>
        </Container>
      </Navbar>

      {/* Mobile Drawer */}
      <div
        className={`sidebar ${state.collapsed ? "collapsed" : "expanded"} ${
          darkMode ? "dark" : ""
        }`}
      >
        <div className="d-flex flex-column ">
          <Nav className="flex-column gap-3 mt-3">
            <Nav.Link
              as={Link}
              to="/"
              className="sidebar-link"
              onClick={() => setState((prev) => ({ ...prev, collapsed: true }))}
            >
              <i className="bi bi-house-door-fill"></i>
              {!state.collapsed && <span>Home</span>}
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/restaurants"
              className="sidebar-link"
              onClick={() => setState((prev) => ({ ...prev, collapsed: true }))}
            >
              <i className="bi bi-shop"></i>
              {!state.collapsed && <span>Restaurants</span>}
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/cart"
              className="sidebar-link"
              onClick={() => setState((prev) => ({ ...prev, collapsed: true }))}
            >
              <i className="bi bi-cart4"></i>
              {!state.collapsed && <span>Cart</span>}
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/favorites"
              className="sidebar-link"
              onClick={() => setState((prev) => ({ ...prev, collapsed: true }))}
            >
              <i className="bi bi-heart-fill"></i>
              {!state.collapsed && <span>Favorites</span>}
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/add-restaurant"
              className="sidebar-link"
              onClick={() => setState((prev) => ({ ...prev, collapsed: true }))}
            >
              <i className="bi bi-plus-circle-fill"></i>
              {!state.collapsed && <span>Add Restaurant</span>}
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/RestaurantSearch"
              className="sidebar-link"
              onClick={() => setState((prev) => ({ ...prev, collapsed: true }))}
            >
              <i className="bi bi-search"></i>
              {!state.collapsed && <span>Search Restaurant</span>}
            </Nav.Link>
          </Nav>

          {/*  in mobile sidebar  */}
          {!state.collapsed && (
            <div className="d-flex flex-column gap-2 d-lg-none mt-2 px-2">
              {FoodToggle}
              {DarkToggle}
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {state.showLoginForm && (
        <LoginForm
          show={state.showLoginForm}
          onClose={() =>
            setState((prev) => ({ ...prev, showLoginForm: false }))
          }
          onSignupClick={() =>
            setState((prev) => ({
              ...prev,
              showLoginForm: false,
              showSignupForm: true,
            }))
          }
          onLoginSuccess={(loggedUser) =>
            setState((prev) => ({
              ...prev,
              user: loggedUser,
              showLoginForm: false,
              showToast: true,
              toastMessage: `Welcome back, ${loggedUser.fullName}`,
            }))
          }
        />
      )}

      {/* Signup Modal */}
      {state.showSignupForm && (
        <SignupForm
          show={state.showSignupForm}
          onClose={() =>
            setState((prev) => ({ ...prev, showSignupForm: false }))
          }
          onLoginClick={() =>
            setState((prev) => ({
              ...prev,
              showSignupForm: false,
              showLoginForm: true,
            }))
          }
        />
      )}

      {/* MyToast */}
      {state.showToast && (
        <MyToast
          show={state.showToast}
          message={state.toastMessage}
          onClose={() => setState((prev) => ({ ...prev, showToast: false }))}
          position="top-center"
          type="success"
        />
      )}
    </>
  );
};

export default Header;
