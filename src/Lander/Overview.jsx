import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { calcUpcomingNotes, useFetch } from "../utils";
import { ACTIONS, API_URL, REQUEST_STATUS } from "../constants";

const Overview = ({ appDispatch, upcomingNotes }) => {
  const url = `${API_URL}/notes/overview`;
  const reqOptions = useMemo(
    () => ({
      method: "GET",
      headers: { Authorization: localStorage.getItem("mokkoAuthToken") },
    }),
    []
  );

  const { data, status, error } = useFetch(url, reqOptions);
  useEffect(() => {
    appDispatch({
      type: ACTIONS.SET_UPCOMING_NOTES,
      upcomingNotes: calcUpcomingNotes(data),
    });
  }, [data, appDispatch]);

  return status === REQUEST_STATUS.ERROR ? (
    <div> {(`UPCOMING ERROR PAGE; ALSO: ${error}`)} </div>
  ) : (
    <>
      {status === REQUEST_STATUS.LOADING && <div> SPINNER </div>}
      <h1>Upcoming Notes</h1>
      <p>{`Today: ${upcomingNotes.today.length} notes`}</p>
      <p>{`Tomorrow: ${upcomingNotes.tomorrow.length} notes`}</p>
      <p>{`Rest of Week: ${upcomingNotes.restOfWeek.length} notes`}</p>
      <Link to="/review">Review Today&apos;s Notes</Link>
    </>
  );
};

export default Overview;
