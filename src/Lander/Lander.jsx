import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import { calcUpcomingNotes, useFetch } from "../utils";
import { API_URL } from "../constants";

const Overview = ({ setUpcomingNotes, upcomingNotes }) => {
  const url = `${API_URL}/notes/overview`;
  const reqOptions = useMemo(
    () => ({
      method: "GET",
      headers: { Authorization: localStorage.getItem("mokkoAuthToken") },
    }),
    []
  );

  // @TODO: add loading spinner
  const { data } = useFetch(url, reqOptions);
  useEffect(() => {
    setUpcomingNotes(calcUpcomingNotes(data));
  }, [data, setUpcomingNotes]);

  return (
    <>
      <h1>Upcoming Notes</h1>
      <p>{`Today: ${upcomingNotes.today.length} notes`}</p>
      <p>{`Tomorrow: ${upcomingNotes.tomorrow.length} notes`}</p>
      <p>{`Rest of Week: ${upcomingNotes.restOfWeek.length} notes`}</p>
      <Link to="/review">Review Today&apos;s Notes</Link>
    </>
  );
};

const Welcome = () => (
  <>
    <h1>Welcome to Mokko!</h1>
    <p>(Or &quot;Forster&quot;; not sure which yet)</p>
    <p>(actual description of app goals goes here... later)</p>
  </>
);

const Lander = ({
  isLoggedIn,
  setIsLoggedIn,
  upcomingNotes,
  setUpcomingNotes,
}) => {
  const logOut = () => {
    localStorage.removeItem("mokkoAuthToken");
    setIsLoggedIn(false);
  };

  return (
    <Container fluid="lg">
      <Row lg={{ span: 6, offset: 3 }}>
        <Nav className="justify-content-end">
          <Nav.Item>
            {isLoggedIn ? (
              <Button type="button" variant="link" onClick={logOut}>
                Log Out
              </Button>
            ) : (
              <Link to="/login">Log In</Link>
            )}
          </Nav.Item>
        </Nav>
      </Row>

      <Row lg={{ span: 6, offset: 3 }}>
        {isLoggedIn ? (
          <Overview
            upcomingNotes={upcomingNotes}
            setUpcomingNotes={setUpcomingNotes}
          />
        ) : (
          <Welcome />
        )}
      </Row>
    </Container>
  );
};

export default Lander;
