import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // custom theme context,dark-light mode
import "./styles/theme.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import { FilterProvider } from "./context/FilterContext";
import RestaurantsPage from "./pages/restaurant/RestaurantList";
import RestaurantDetails from "./pages/restaurant/RestaurantDetails";
import CssBaseline from "@mui/material/CssBaseline";
import FormTheme from "./config/theme/Theme";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"; //mui theme provider


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

                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDetails />} /> {/* Dynamic route for restaurant details */}
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
