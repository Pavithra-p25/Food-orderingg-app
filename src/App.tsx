import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import { FilterProvider } from "./context/FilterContext";
import RestaurantsPage from "./pages/restaurant/RestaurantList";
import RestaurantDetails from "./pages/restaurant/RestaurantDetails";


const App: React.FC = () => {
  return (
  
    <Router>
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
    </Router>
  );
};

export default App;
