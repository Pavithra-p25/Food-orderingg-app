import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // custom theme context,dark-light mode
import "./styles/theme.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import { FilterProvider } from "./context/FilterContext";
//import RestaurantDetails from "./pages/restaurant/RestaurantDetails";
import CssBaseline from "@mui/material/CssBaseline";
import FormTheme from "./config/theme/Theme";
import { useNavigate } from "react-router-dom";
import RestaurantForm from "./pages/restaurant/RestaurantForm";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"; //mui theme provider
import RestaurantSearch from "./pages/restaurant/RestaurantSearch";
import RestaurantListing from "./pages/restaurant/RestaurantList";
import RestaurantInfo from "./pages/restaurant/RestaurantInfo";

const AddRestaurantModal = () => {
  const navigate = useNavigate();

  return (
    <RestaurantForm
      show={true}
      onClose={() => navigate(-1)} // close popup → go back
    />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MuiThemeProvider theme={FormTheme}>
        <CssBaseline /> {/* to reset default browser css */}
        <ThemeProvider>
          <FilterProvider>
            {/* FULL PAGE FLEXBOX */}
            <div className="d-flex flex-column min-vh-100">
              <Header />

              {/* MAIN CONTENT  */}
              <main className="flex-grow-1 pt-5">
                <Routes>
                  <Route path="/restaurants" element={<RestaurantListing />} />
                  {/*}   <Route path="/restaurants/:id" element={<RestaurantDetails />} /> {/* Dynamic route for restaurant details */}
                  <Route
                    path="/RestaurantSearch"
                    element={<RestaurantSearch />}
                  />

                  <Route
                    path="/add-restaurant"
                    element={<AddRestaurantModal />}
                  />

                  <Route path="/restaurantinfo" element ={<RestaurantInfo/>}/>
                </Routes>
              </main>

              <Footer />
            </div>
          </FilterProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
