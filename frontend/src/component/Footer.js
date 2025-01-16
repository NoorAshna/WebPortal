import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-3 mt-2">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>Discover the latest job openings across various industries. Browse through our curated selection and find the perfect fit for your skills and experience</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/about" className="text-white">About</a></li>
              <li><a href="/contact" className="text-white">Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li><a href="https://facebook.com" className="text-white">Facebook</a></li>
              <li><a href="#" className="text-white">X</a></li>
              <li><a href="https://instagram.com" className="text-white">Instagram</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="text-center py-3">
        <small>&copy; 2024  "Company". All rights reserved.</small>
      </div>
    </footer>
  );
};

export default Footer;
