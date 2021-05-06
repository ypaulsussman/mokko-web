import React from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";

const Header = ({ page, isLoggedIn, setIsLoggedIn }) => {
  const logOut = () => {
    localStorage.removeItem("mokkoAuthToken");
    setIsLoggedIn(false);
  };

  const navItems = [];

  ["login", "review"].includes(page) &&
    navItems.push(
      <Nav.Item key="home-link">
        <Link to="/">Home</Link>
      </Nav.Item>
    );

  isLoggedIn &&
    navItems.push(
      <Nav.Item key="logout-link">
        <Link to="/" onClick={logOut}>
          Log Out
        </Link>
      </Nav.Item>
    );

  page === "lander" &&
    !isLoggedIn &&
    navItems.push(
      <Nav.Item key="logout-link">
        <Link to="/login">Log In</Link>
      </Nav.Item>
    );

  return (
    <Row lg={{ span: 6, offset: 3 }}>
      <Nav className="justify-content-end">{navItems}</Nav>
    </Row>
  );
};

export default Header;
