import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../../context/FilterContext";
import { useRestaurants } from "../../hooks/restaurant/useRestaurant";
import type { Restaurant } from "../../types/types";
import MyButton from "../../components/button/MyButton";
import "../../components/Button/Button.css";
import RestaurantForm from "./RestaurantForm";
import MyCard from "../../components/cards/MyCard";
import MyFilterinput from "../../components/filters/MyFilterinput";
import MyFilterdropdown from "../../components/filters/MyFilterdropdown";

interface ListingState {
  search: string;
  showForm: boolean;
}

const RestaurantListing: React.FC = () => {
  const navigate = useNavigate();

  const {
    search,
    setSearch,
    category,
    setCategory,
    filterType,
    setFilterType,
  } = useFilter();

  //  state object
  const [state, setState] = useState<ListingState>({
    search: "",
    showForm: false,
  });

  const { showForm } = state;

  //  LOCAL STATE
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //  useRestaurants hook
  const { getAllRestaurants } = useRestaurants();

  //  FETCH RESTAURANTS 
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      const data = await getAllRestaurants();
      setRestaurants(data);

      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  // FILTER LOGIC 
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesName = r.name.toLowerCase().includes(search.toLowerCase());

    if (!category.trim()) return matchesName;

    return (
      matchesName &&
      r.category.toLowerCase().includes(category.toLowerCase())
    );
  });

  return (
    <Container className="my-4" style={{ marginTop: "100px" }}>
      {loading && <p>Loading restaurants...</p>}
      {error && <p className="text-danger">{error}</p>}

      <Row className="g-3">
        {/* FILTERS  */}
        <Col xs={12} md={3} lg={3}>
          <div className="p-3 border rounded" style={{ background: "#f8f9fa", }}>
            <label className="fw-bold mb-2 d-block">Filters</label>

            {/* Category Input */}
            <div className="mb-3">
              <label className="form-label ">Category</label>
              <MyFilterinput
                placeholder="Enter category"
                value={category}
                onChange={(value: string) => setCategory(value)}
                 icon={<i className="bi bi-funnel"></i>}
              />
            </div>

            {/* Rating Dropdown */}
            <div className="mb-3">
              <label className="form-label ">Rating</label>
              <MyFilterdropdown
                value={filterType}
                options={["Rating 4+", "Rating 3+"]}
                onChange={(value: string) => setFilterType(value)}
                icon={<i className="bi bi-star-fill text-warning"></i>}
              />
            </div>
          </div>
        </Col>


        {/* SEARCH + CARDS */}
        <Col xs={12} md={9} lg={9} className="p-0">
          {/* Search */}
          <MyFilterinput
            label="Search"

            placeholder="Search restaurants..."
            value={search}
            onChange={(value: string) => setSearch(value)}
             icon={<i className="bi bi-search"></i>} 
          />

          {/* Cards */}
          <Row className="g-4 mt-0">
            {filteredRestaurants.map((restaurant) => (
              <Col md={6} lg={4} key={restaurant.id}>
                <MyCard
                  image={restaurant.image}
                  title={restaurant.name}
                  subtitle={restaurant.category}
                  description={`⭐ Rating: ${restaurant.rating}`}
                  buttonText="View Menu"
                  buttonClassName="theme-btn primary"
                  onButtonClick={() =>
                    navigate(`/restaurants/${restaurant.id}`)
                  }
                />
              </Col>
            ))}
          </Row>
          
      {/* NOT FOUND MESSAGE */}
      {!loading && !error && filteredRestaurants.length === 0 && (
        <p className="text-center text-muted mt-4 fw-bold">
          🍽️ Restaurant not found
        </p>
      )}
      
          {/* Load More */}
          <div className="text-center mt-4">
            <MyButton className="theme-btn primary mt-3">
              Load More
            </MyButton>
          </div>
        </Col>

      </Row>





      {/* Join Us */}
      <Row className="mt-5 position-relative">
        <Col>
          <Card
            className="text-center p-4 shadow-sm border-0"
            style={{
              background: "linear-gradient(to right, white, #ff9999)",
              borderRadius: "12px",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              alt="Icon"
              className="position-absolute start-0 top-50 translate-middle-y"
              style={{ width: "60px", opacity: 0.5 }}
            />

            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046790.png"
              alt="Icon"
              className="position-absolute start-0 top-25 translate-middle-y"
              style={{ width: "50px", opacity: 0.5 }}
            />

            <Card.Body>
              <Card.Title className="mb-3 fs-3 fw-semibold">
                Own a Restaurant? Join Us Today!
              </Card.Title>
              <Card.Text className="mb-4">
                Reach thousands of hungry customers. Sign up now and start receiving orders online.
              </Card.Text>
              <MyButton
                onClick={() =>
                  setState((prev) => ({ ...prev, showForm: true }))
                }
                className="theme-btn primary px-4 py-2"
              >
                Register Now
              </MyButton>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <RestaurantForm
        show={showForm}
        onClose={() =>
          setState((prev) => ({ ...prev, showForm: false }))
        }
      />
    </Container>
  );
};

export default RestaurantListing;
