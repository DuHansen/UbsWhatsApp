import React, { useState } from 'react';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../src/App.css';

export default function Header() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar expand="md" fixed="top" variant="light" style={{ backgroundColor: 'white' }}>
      <Container fluid>
        <Nav className="d-none d-md-flex mx-auto gap-4">
          <Nav.Link as={Link} to="/" style={linkStyle}>Bot Sus</Nav.Link>
          <Nav.Link as={Link} to="/consultas" style={linkStyle}>Consultas</Nav.Link>
          <Nav.Link as={Link} to="/relatorios" style={linkStyle}>Relatórios</Nav.Link>
        </Nav>
        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={handleShow}
          className="d-md-none"
          style={{ border: "none" }}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          show={show}
          onHide={handleClose}
          className="d-md-none"
          style={{ backgroundColor: "white" }}
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id="offcanvasNavbarLabel" style={{ color: "#102E4A" }}>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="flex-column text-center">
              <Nav.Link as={Link} to="/" onClick={handleClose} style={linkStyle}>Bot Sus</Nav.Link>
              <Nav.Link as={Link} to="/consultas" onClick={handleClose} style={linkStyle}>Consultas</Nav.Link>
              <Nav.Link as={Link} to="/relatorios" onClick={handleClose} style={linkStyle}>Relatórios</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

      </Container>
    </Navbar>
  );
}

const linkStyle = {
  fontSize: "1.1rem",
  fontWeight: "500",
  textDecoration: "none",
  padding: "0.5rem 1rem",
  color: "#102E4A"
};
