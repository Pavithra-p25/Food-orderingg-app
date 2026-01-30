import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import FormTheme from "./config/theme/Theme";
import { useRestaurantInfo } from "./hooks/useRestaurantInfo";

import HomePage from "./pages/HomePage";
import RestaurantList from "./pages/restaurant/RestaurantList";
import RestaurantMenu from "./pages/restaurant/RestaurantMenu";
import RestaurantSearch from "./pages/restuarantsearch/RestaurantSearch";
import RestaurantInfo from "./pages/restaurantinfo/RestaurantInfo";
import RestaurantInfoList from "./pages/restaurantinfo/RestaurantInfoList";
import RestaurantForm from "./pages/registerrestaurant/RestaurantForm";

const AddRestaurantModal = () => {
  const navigate = useNavigate();

  return <RestaurantForm show={true} onClose={() => navigate(-1)} />;
};

const AppRoutes = () => {
  const { editRestaurantInfo } = useRestaurantInfo(); 

  return (
    <Routes>
      <Route path="/HomePage" element={<HomePage />} />
      <Route path="/restaurants" element={<RestaurantList />} />
      <Route path="/restaurants/:id" element={<RestaurantMenu />} />
      <Route path="/RestaurantSearch" element={<RestaurantSearch />} />
      <Route path="/add-restaurant" element={<AddRestaurantModal />} />

      {/* Add Restaurant Info */}
      <Route
        path="/restaurantinfo"
        element={<RestaurantInfo editRestaurantInfo={editRestaurantInfo} />}
      />

      {/* Edit Restaurant Info */}
      <Route
        path="/restaurantinfo/edit/:id"
        element={<RestaurantInfo editRestaurantInfo={editRestaurantInfo} />}
      />

      <Route path="/RestaurantInfoList" element={<RestaurantInfoList />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MuiThemeProvider theme={FormTheme}>
        <CssBaseline />
        <ThemeProvider>
          <SnackbarProvider>
            <div className="d-flex flex-column min-vh-100">
              <Header />
              <main className="flex-grow-1 pt-5">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </SnackbarProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
