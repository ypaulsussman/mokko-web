import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { callAPI } from "../utils";
import { ACTIONS, API_URL, PAGES } from "../constants";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import ReviewForm from "./ReviewForm";

const Review = ({ appState, appDispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    callAPI(`${API_URL}/notes/review`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
    })
      .then(({ notes, prompts }) => {
        setIsLoading(false);
        appDispatch({
          type: ACTIONS.SET_REVIEW_NOTES,
          notesToReview: notes,
          allPrompts: prompts,
        });
      })
      .catch(({ message }) => {
        setIsLoading(false);
        setError(message);
      });
  }, [appDispatch]);

  // Handle user-initiated browser-refresh
  // (...until you add a db-field to persist a user's intra-day progress)
  const history = useHistory();
  useEffect(() => {
    if (appState.notesToReview && !appState.notesToReview.length) {
      history.push("/");
    }
    const confirmNavAway = (e) => e.preventDefault();
    window.addEventListener("beforeunload", confirmNavAway);
    return () => window.removeEventListener("beforeunload", confirmNavAway);
  }, [history, appState.notesToReview]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Header
        page={PAGES.REVIEW}
        isLoggedIn={appState.isLoggedIn}
        appDispatch={appDispatch}
      />
      {error ? (
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
