import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import FormTheme from "./config/theme/Theme";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import RestaurantList from "./pages/restaurant/RestaurantList";
import RestaurantMenu from "./pages/restaurant/RestaurantMenu";
import RestaurantSearch from "./pages/restuarantsearch/RestaurantSearch";
import RestaurantInfo from "./pages/restaurantinfo/RestaurantInfo";
import RestaurantInfoList from "./pages/restaurantinfo/RestaurantInfoList";
import RestaurantForm from "./pages/registerrestaurant/RestaurantForm";
import { FavProvider } from "./context/FavContext";


/*  Routes */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
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
      <Route path="/RestaurantInfo/edit/:id" element={<RestaurantInfo />} />
      <Route path="/RestaurantInfoList" element={<RestaurantInfoList />} />
    </Routes>
  );
};

/*  App Root  */
const App: React.FC = () => {
  return (
    <Router>
      <MuiThemeProvider theme={FormTheme}>
        <CssBaseline />
        <ThemeProvider>
          <SnackbarProvider>
             <FavProvider>
            <div className="d-flex flex-column min-vh-100">
              <Header />
              <main className="flex-grow-1 pt-5">
                <AppRoutes />
              </main>
              <Footer />
            </div>
            </FavProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
