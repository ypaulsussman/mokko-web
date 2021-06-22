import React, { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { useFetch } from "../utils";
import { ACTIONS, API_URL, PAGES, REQUEST_STATUS } from "../constants";

import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import ReviewForm from "./ReviewForm";

const Review = ({ appState, appDispatch }) => {
  // Fetch notesToReview && associated cues; set in appReducer
  const [{ data, status, error }, makeRequest] = useFetch();
  const reqOptions = useMemo(
    () => ({
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
    }),
    []
  );

  useEffect(() => {
    makeRequest({ url: `${API_URL}/notes/review`, opts: reqOptions });
    if (data) {
      appDispatch({
        type: ACTIONS.SET_REVIEW_NOTES,
        notesToReview: data.notes,
        allPrompts: data.prompts,
      });
    }
  }, [appDispatch, data, makeRequest, reqOptions]);

  // Handle user-initiated browser-refresh
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
      {status === REQUEST_STATUS.LOADING && <LoadingSpinner />}
      <Header
        page={PAGES.REVIEW}
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
