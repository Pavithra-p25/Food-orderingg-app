import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DescriptionIcon from "@mui/icons-material/Description";
import { ThemeContext } from "../context/ThemeContext";
import LoginForm from "../pages/authentication/LoginForm";
import SignupForm from "../pages/authentication/SignupForm";
import { ListItemButton } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext";
import { useNavigate } from "react-router-dom";

type FoodMode = "veg" | "nonveg" | null;

interface HeaderState {
  showLoginForm: boolean;
  showSignupForm: boolean;
  collapsed: boolean;
  foodMode: FoodMode;
  user: any | null;
}

const Header: React.FC = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState<HeaderState>({
    showLoginForm: false,
    showSignupForm: false,
    collapsed: true,
    foodMode: null,
    user: null,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setState((prev) => ({ ...prev, user: JSON.parse(storedUser) }));
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const FoodToggle = (
    <Box display="flex" width="220px">
      <Button
        fullWidth
        variant={state.foodMode === "veg" ? "contained" : "outlined"}
        color="success"
        onClick={() =>
          setState((prev) => ({
            ...prev,
            foodMode: prev.foodMode === "veg" ? null : "veg",
          }))
        }
      >
        Veg
      </Button>
      <Button
        fullWidth
        variant={state.foodMode === "nonveg" ? "contained" : "outlined"}
        color="error"
        onClick={() =>
          setState((prev) => ({
            ...prev,
            foodMode: prev.foodMode === "nonveg" ? null : "nonveg",
          }))
        }
      >
        Non-Veg
      </Button>
    </Box>
  );

  const DarkToggle = (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography>{darkMode ? "Dark" : "Light"}</Typography>
      <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
    </Box>
  );

  const menuItems = [
    {
      text: "Home",
      icon: <HomeIcon />,
      to: "/HomePage",
      roles: ["user", "admin"],
    },
    {
      text: "Restaurants",
      icon: <StoreIcon />,
      to: "/restaurants",
      roles: ["user", "admin"],
    },
    {
      text: "Cart",
      icon: <ShoppingCartIcon />,
      to: "/cart",
      roles: ["user", "admin"],
    },
    {
      text: "Favorites",
      icon: <FavoriteIcon />,
      to: "/favorites",
      roles: ["user", "admin"],
    },

    //  ADMIN ONLY
    {
      text: "Add Restaurant",
      icon: <AddCircleIcon />,
      to: "/add-restaurant",
      roles: ["admin"],
    },
    {
      text: "Search Restaurant",
      icon: <SearchIcon />,
      to: "/RestaurantSearch",
      roles: ["admin"],
    },
    {
      text: "Restaurant Info",
      icon: <DescriptionIcon />,
      to: "/RestaurantInfo",
      roles: ["admin"],
    },
    {
      text: "Restaurant Info List",
      icon: <FormatListBulletedIcon />,
      to: "/RestaurantInfoList",
      roles: ["admin"],
    },
  ];
  const renderPersonSection = () => {
    if (state.user) {
      return (
        <>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <PersonIcon />
            <Typography ml={1}>{state.user.fullName}</Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => alert("Go to profile page")}>
              <PersonIcon fontSize="small" />
              My Profile
            </MenuItem>

            <MenuItem
              onClick={() => {
                localStorage.removeItem("user");
                setState((prev) => ({ ...prev, user: null }));
                showSnackbar("Logged out successfully", "success"); //  global snackbar
                setAnchorEl(null);
                navigate("/HomePage"); 
              }}
            >
              <LogoutIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </>
      );
    }
    return (
      <Box
        display="flex"
        alignItems="center"
        sx={{ cursor: "pointer" }}
        onClick={() => setState((prev) => ({ ...prev, showLoginForm: true }))}
      >
        <PersonIcon />
        <Typography ml={1}>Login</Typography>
      </Box>
    );
  };

  return (
    <>
      {/* AppBar */}
      <AppBar position="fixed" color={darkMode ? "default" : "inherit"}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            sx={{ color: "#333333" }}
            onClick={() =>
              setState((prev) => ({ ...prev, collapsed: !prev.collapsed }))
            }
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: darkMode ? "white" : "#e23744" }}
          >
            FoodExpress
          </Typography>

          <Box display={{ xs: "none", lg: "flex" }} gap={1}>
            {DarkToggle}
            {FoodToggle}
            {renderPersonSection()}
          </Box>

          <Box display={{ xs: "flex", lg: "none" }}>
            {renderPersonSection()}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
        <Drawer
          variant={window.innerWidth >= 1200 ? "permanent" : "temporary"}
          open={!state.collapsed}
          onClose={() => setState((prev) => ({ ...prev, collapsed: true }))}
          sx={{
            width: state.collapsed ? 72 : 260,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: state.collapsed ? 72 : 260,
              boxSizing: "border-box",
              top: "64px", // height of AppBar
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          <Box sx={{ mt: "8px", ml: "8px", pt: 0 }}>
            <List>
              {menuItems
                .filter(
                  (item) => state.user && item.roles.includes(state.user.role),
                )
                .map((item) => (
                  <ListItem
                    key={item.text}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      component={Link}
                      to={item.to}
                      onClick={() =>
                        window.innerWidth < 1200 &&
                        setState((prev) => ({ ...prev, collapsed: true }))
                      }
                      sx={{
                        minHeight: 48,
                        justifyContent: state.collapsed
                          ? "center"
                          : "flex-start",
                        px: 2.5,
                        backgroundColor:
                          location.pathname === item.to
                            ? "rgba(226, 55, 68, 0.12)"
                            : "transparent",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: state.collapsed ? "auto" : 2,
                          justifyContent: "center",
                          color: "#333333",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!state.collapsed && (
                        <ListItemText
                          primary={item.text}
                          sx={{
                            color:
                              location.pathname === item.to
                                ? "#e23744"
                                : "inherit",
                            fontWeight:
                              location.pathname === item.to ? 600 : 400,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>

            {/* Mobile toggles */}
            <Box p={2} display={{ lg: "none" }} gap={2}>
              {FoodToggle}
              {DarkToggle}
            </Box>
          </Box>
        </Drawer>
  

      {/* Login */}
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

      {/* Signup */}
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

    </>
  );
};

export default Header;
