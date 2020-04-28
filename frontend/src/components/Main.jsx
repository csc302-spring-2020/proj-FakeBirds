import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import icon from "../img/main-icon.png";

const link = {
  fontWeight: "bold",
  fontSize: "16px",
  lineHeight: "21px",
  color: "#E7EFF6",
  paddingRight: "35px",
  textDecoration: "none",
};

export default class Main extends Component {
  render() {
    return (
      <div className="app-frame">
        <Navbar
          collapseOnSelect
          expand="lg"
          fixed="top"
          style={{
            width: "100vw",
            height: "50px",
            backgroundColor: "#5495C9",
          }}
        >
          <Link to="/">
            <img
              style={{ width: "50px", marginLeft: "50px", paddingTop: "18px" }}
              src={icon}
              alt=""
            />
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto" style={{ paddingRight: "50px" }}>
              <Link style={link} to="/Draft">
                Draft
              </Link>
              <Link style={link} to="/patients">
                Patients
              </Link>
              <Link style={link} to="/about">
                About
              </Link>
              <Link style={link} to="/contact">
                Contact Us
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}
