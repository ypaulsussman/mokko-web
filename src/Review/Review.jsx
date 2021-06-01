import React, { useEffect, useMemo } from "react";
import Header from "../shared/Header/Header";
import { useHistory } from "react-router-dom";
import { useFetch } from "../utils";
import { ACTIONS, API_URL, REQUEST_STATUS } from "../constants";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import ReviewForm from "./ReviewForm";

const Review = ({ appState, appDispatch }) => {
  // Handle user-initiated browser-refresh
  const history = useHistory();
  useEffect(() => {
    if (!appState.upcomingNotes.today.length) {
      history.push("/");
    }
    const confirmNavAway = (e) => e.preventDefault();
    window.addEventListener("beforeunload", confirmNavAway);
    return () => window.removeEventListener("beforeunload", confirmNavAway);
  }, [history, appState.upcomingNotes.today]);

  // Fetch upcomingNotes' full data; set in appReducer
  const url = `${API_URL}/notes/review`;
  const reqOptions = useMemo(
    () => ({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
      body: JSON.stringify(appState.upcomingNotes),
    }),
    [appState.upcomingNotes]
  );
  const { data, status, error } = useFetch(url, reqOptions);
  useEffect(() => {
    if (data) {
      appDispatch({
        type: ACTIONS.SET_REVIEW_NOTES,
        notesToReview: data.notes,
        allPrompts: data.prompts,
      });
    }
  }, [data, appDispatch]);

  return (
    <>
      {status === REQUEST_STATUS.LOADING && <LoadingSpinner />}
      <Header
        page="review"
        isLoggedIn={appState.isLoggedIn}
        appDispatch={appDispatch}
      />
      {status === REQUEST_STATUS.ERROR ? (
        <ErrorMessage message={error} />
      ) : (
        appState.notesToReview && (
          <ReviewForm
            currentNote={appState.notesToReview[0]}
            allPrompts={appState.allPrompts}
            mokkoStatus={appState.mokkoStatus}
            appDispatch={appDispatch}
          />
        )
      )}
    </>
  );
};

export default Review;
