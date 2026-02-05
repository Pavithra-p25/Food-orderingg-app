import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/error/ErrorFallback";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { FavProvider } from "./context/FavContext";
import { getTheme } from "./config/theme/Theme";
import { DialogSnackbarProvider } from "./context/DialogSnackbarContext";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import RestaurantList from "./pages/restaurant/RestaurantList";
import RestaurantMenu from "./pages/restaurant/RestaurantMenu";
import RestaurantSearch from "./pages/restuarantsearch/RestaurantSearch";
import RestaurantInfo from "./pages/restaurantinfo/RestaurantInfo";
import RestaurantInfoList from "./pages/restaurantinfo/RestaurantInfoList";
import RestaurantForm from "./pages/registerrestaurant/RestaurantForm";

/* Routes */
const AppRoutes = () => (
  <Routes>
    <Route path="/HomePage" element={<HomePage />} />
    <Route path="/restaurants" element={<RestaurantList />} />
    <Route path="/restaurants/:id" element={<RestaurantMenu />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/RestaurantSearch" element={<RestaurantSearch />} />
    <Route path="/RestaurantForm" element={<RestaurantForm />} />
    <Route path="/restaurant/register" element={<RestaurantForm />} />
    <Route path="/restaurant/edit/:id" element={<RestaurantForm />} />
    <Route path="/RestaurantInfo" element={<RestaurantInfo />} />
    <Route path="/restaurant-info/edit/:id" element={<RestaurantInfo />} />
    <Route path="/RestaurantInfoList" element={<RestaurantInfoList />} />
  </Routes>
);

/* This component CAN read darkMode */
const AppContent = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <MuiThemeProvider theme={getTheme(darkMode ? "dark" : "light")}>
       <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CssBaseline />
      <DialogSnackbarProvider>
        <FavProvider>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 pt-5">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </FavProvider>
      </DialogSnackbarProvider>
      </ErrorBoundary>
    </MuiThemeProvider>
  );
};

/* Root */
const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
};

export default App;
