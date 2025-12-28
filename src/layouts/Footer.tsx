import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ThemeContext } from "../context/ThemeContext";

const Footer: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <footer
      className={`mt-4 py-4 ${
        darkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <Container>
        <Row className="gy-4 align-items-center">
          {/* Brand Section */}
          <Col md={4}>
            <h4 className="fw-bold">FoodExpress</h4>
            <p>Fastest food delivery at your doorstep.</p>
          </Col>

          {/*  Contact */}
          <Col md={4}>
            <h5 className="fw-semibold mb-2">Contact</h5>
            <p className="m-0">Email: support@foodexpress.com</p>
            <p className="m-0">Phone: +91 9876543210</p>
          </Col>

          {/* Social Icons */}
          <Col
            md={4}
            className="d-flex justify-content-md-end justify-content-start gap-3 fs-4"
          >
            <i className="bi bi-facebook"></i>
            <i className="bi bi-instagram"></i>
            <i className="bi bi-youtube"></i>
            <i className="bi bi-twitter"></i>
          </Col>
        </Row>

        {/* Bottom Line */}
        <div className="text-center mt-4">
          © 2025 FoodExpress. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
