import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { withRouter } from "react-router-dom";
function TopBar({ location }) {
  const { pathname } = location;
  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Navbar.Brand href="#home">Yelp App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/" active={pathname == "/"}>
            Business Search
          </Nav.Link>
          <Nav.Link href="/eventsearch" active={pathname == "/eventsearch"}>
            Events Search
          </Nav.Link>
          <Nav.Link href="/phonesearch" active={pathname == "/phonesearch"}>
            Phone Search
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default withRouter(TopBar);