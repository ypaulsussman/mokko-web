import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { calcUpcomingNotes, useFetch } from "../utils";
import { API_URL, ACTIONS } from "../constants";
import Header from "../shared/Header/Header";

const Overview = ({ appDispatch, upcomingNotes }) => {
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
    appDispatch({
      type: ACTIONS.SET_UPCOMING_NOTES,
      upcomingNotes: calcUpcomingNotes(data),
    });
  }, [data, appDispatch]);

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

const Lander = ({ appState: { isLoggedIn, upcomingNotes }, appDispatch }) => {
  return (
    <div>
      <Header page="lander" isLoggedIn={isLoggedIn} appDispatch={appDispatch} />

      {isLoggedIn ? (
        <Overview upcomingNotes={upcomingNotes} appDispatch={appDispatch} />
      ) : (
        <Welcome />
      )}
    </div>
  );
};

export default Lander;
