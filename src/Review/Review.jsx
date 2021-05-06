import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Header from "../shared/Header/Header";

const Review = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <Container fluid="lg">
      <Header
        page="review"
        isLoggedIn={{ isLoggedIn }}
        setIsLoggedIn={{ setIsLoggedIn }}
      />

      <Row lg={{ span: 6, offset: 3 }}>
        <div>sup</div>
      </Row>
    </Container>
  );
};

export default Review;
