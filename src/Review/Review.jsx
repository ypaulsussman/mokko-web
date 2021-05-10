import React, { useMemo } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Header from "../shared/Header/Header";
import { useFetch } from "../utils";
import { API_URL } from "../constants";

const Review = ({ isLoggedIn, setIsLoggedIn, upcomingNotes }) => {
  const url = `${API_URL}/notes/review`;
  const reqOptions = useMemo(
    () => ({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("mokkoAuthToken"),
      },
      body: JSON.stringify(upcomingNotes),
    }),
    [upcomingNotes]
  );

  // @TODO: add loading spinner
  const { data } = useFetch(url, reqOptions);
  console.log("data: ", data);

  return (
    <Container fluid="lg">
      <Header
        page="review"
        isLoggedIn={{ isLoggedIn }}
        setIsLoggedIn={setIsLoggedIn}
      />

      <Row lg={{ span: 6, offset: 3 }}>
        <div>sup</div>
      </Row>
    </Container>
  );
};

export default Review;
