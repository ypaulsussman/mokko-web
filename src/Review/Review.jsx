import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";

const Review = ({ isLoggedIn, setIsLoggedIn }) => {
  const logOut = () => {
    localStorage.removeItem("mokkoAuthToken");
    setIsLoggedIn(false);
  };

  return (
    <Container fluid="lg">
      <Row lg={{ span: 6, offset: 3 }}>
        <Nav className="justify-content-end">
          <Nav.Item>
            <Link to="/">Home</Link>
          </Nav.Item>
          <Nav.Item>
            {isLoggedIn && (
              <Link to="/" onClick={logOut}>
                Log Out
              </Link>
            )}
          </Nav.Item>
        </Nav>
      </Row>

      <Row lg={{ span: 6, offset: 3 }}>
        <div>sup</div>
      </Row>
    </Container>
  );
};

export default Review;
