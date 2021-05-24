import React, { useEffect, useMemo } from "react";
import Header from "../shared/Header/Header";
import { useFetch } from "../utils";
import { ACTIONS, API_URL, REQUEST_STATUS } from "../constants";

const Review = ({ appState, appDispatch }) => {
  const url = `${API_URL}/notes/review`;
  const reqOptions = useMemo(
    () => ({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("mokkoAuthToken"),
      },
      body: JSON.stringify(appState.upcomingNotes),
    }),
    [appState.upcomingNotes]
  );

  const { data, status, error } = useFetch(url, reqOptions);
  useEffect(() => {
    appDispatch({ type: ACTIONS.SET_REVIEW_NOTES, reviewNotes: data });
  }, [data, appDispatch]);

  return (
    <>
      {status === REQUEST_STATUS.LOADING && <div> SPINNER </div>}
      <Header
        page="review"
        isLoggedIn={appState.isLoggedIn}
        appDispatch={appDispatch}
      />
      {status === REQUEST_STATUS.ERROR ? (
        <div> {`UPCOMING ERROR PAGE; ALSO: ${error}`} </div>
      ) : (
        <>
          <p>sup</p>
          <p>{JSON.stringify(appState.reviewNotes)}</p>
        </>
      )}
    </>
  );
};

export default Review;
