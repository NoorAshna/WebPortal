import { Container, Navbar , Nav} from "react-bootstrap";
import React from "react";
import "../App.css"
import isAuth, { userType } from "../lib/isAuth";

const AppNavbar = () => {
  console.log("nav rendered");
  return (
    <Navbar sticky="top" className="navbar" expand="lg" collapseOnSelect>
      <Container>
      <Container>
          <Navbar.Brand href="/">
            <img
              
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
           Job Portal
          </Navbar.Brand>
        </Container>
        <Navbar.Toggle aria-controls="navbar_content"/>
        <Navbar.Collapse id="navbar_content">
        {isAuth() ? (
          userType() === "recruiter" ? (
            <Nav className="ms-auto">
            <Nav.Link href="/home" className="text-nowrap ">Jobs</Nav.Link>
            <Nav.Link href="/addjob" className="text-nowrap ">Add Jobs</Nav.Link>
            <Nav.Link href="/myjobs" className="text-nowrap ">My Jobs</Nav.Link>
            {/* <Nav.Link href="/employees" className="text-nowrap ">Employees</Nav.Link> */}
            <Nav.Link href="/profile" className="text-nowrap ">Profile</Nav.Link>
            <Nav.Link href="/logout" className="text-nowrap ">Logout</Nav.Link>
          </Nav>
          ) : (
            <Nav className="me-auto ">
              <Nav.Link href="/home" >Jobs</Nav.Link>
              <Nav.Link href="/applications">Applications</Nav.Link>
              <Nav.Link href="/profile">Profile</Nav.Link>
              <Nav.Link href="/logout">LogOut</Nav.Link>
            </Nav>
          )
        ) : (

          <Nav className="me-auto">
          <Nav.Link href="/login">LogIn</Nav.Link>
          <Nav.Link href="/signup">Signup</Nav.Link>
          </Nav>

        )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default React.memo(AppNavbar);
