import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // custom theme context,dark-light mode
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import { FilterProvider } from "./context/FilterContext";
import RestaurantMenu from "./pages/restaurant/RestaurantMenu";
import CssBaseline from "@mui/material/CssBaseline";
import FormTheme from "./config/theme/Theme";
import { useNavigate } from "react-router-dom";
import RestaurantForm from "./pages/registerrestaurant/RestaurantForm";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"; //mui theme provider
import RestaurantSearch from "./pages/restuarantsearch/RestaurantSearch";
import RestaurantInfo from "./pages/restaurantinfo/RestaurantInfo";
import RestaurantInfoList from "./pages/restaurantinfo/RestaurantInfoList";
import HomePage from "./pages/HomePage";
import RestaurantList from "./pages/restaurant/RestaurantList";

const AddRestaurantModal = () => {
  const navigate = useNavigate();

  return (
    <RestaurantForm
      show={true}
      onClose={() => navigate(-1)} // close popup - go back
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
                  <Route path="/HomePage" element={<HomePage />} />
                  <Route
    path="/restaurants"
    element={
      <FilterProvider>
        <RestaurantList />
      </FilterProvider>
    }
  />
                  <Route path="/restaurants/:id" element={<RestaurantMenu />} />{" "}
                  {/* Dynamic route for restaurant details */}
                  <Route
                    path="/RestaurantSearch"
                    element={<RestaurantSearch />}
                  />
                  <Route
                    path="/add-restaurant"
                    element={<AddRestaurantModal />}
                  />
                  <Route
                    path="/restaurantinfo"
                    element={
                      <RestaurantInfo
                        editRestaurantInfo={async (id, data) => {
                          console.log("Editing restaurant:", id, data);
                        }}
                      />
                    }
                  />
                  <Route
                    path="/RestaurantInfoList"
                    element={<RestaurantInfoList />}
                  />
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
