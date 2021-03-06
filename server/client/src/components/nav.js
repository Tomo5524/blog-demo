import React from "react";
// import { Link, NavLink } from "react-router-dom";
import auth from "../services/auth";
import { Link } from "react-router-dom";
import { NavLink } from "react-router";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Form,
  Button,
  FormControl,
} from "react-bootstrap";

const NavBar = () => {
  return (
    <Navbar className="navbar-dark py-3" bg="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        Home
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
        <Nav>
          <Nav.Link as={Link} to="/posts">
            Posts
          </Nav.Link>
          {auth.getUser() !== null ? (
            <React.Fragment>
              <Nav.Link as={Link} to="/add-post">
                Add Post
              </Nav.Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Nav.Link as={Link} to="/sign-up">
                Sign-up
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            </React.Fragment>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
