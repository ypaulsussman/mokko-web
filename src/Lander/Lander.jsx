import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { calcUpcomingNotes, useFetch } from "../utils";
import { API_URL } from "../constants";
import Header from "../shared/Header/Header";

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
  return (
    <div>
      <Header
        page="lander"
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      {isLoggedIn ? (
        <Overview
          upcomingNotes={upcomingNotes}
          setUpcomingNotes={setUpcomingNotes}
        />
      ) : (
        <Welcome />
      )}
    </div>
  );
};

export default Lander;
