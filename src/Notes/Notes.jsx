import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { callAPI } from "../utils";
import { ACTIONS, API_URL, PAGES } from "../constants";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import TextDisplay from "../shared/TextDisplay/TextDisplay";

const Notes = ({ appState, appDispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getNotes = useCallback(
    (page = 1) => {
      setIsLoading(true);
      callAPI(`${API_URL}/notes?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: sessionStorage.getItem("mokkoAuthToken"),
        },
      })
        .then((data) => {
          setIsLoading(false);
          appDispatch({
            type: ACTIONS.SET_NOTES,
            notes: data,
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          setError(message);
        });
    },
    [appDispatch]
  );

  useEffect(() => getNotes(), [getNotes]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Header
        page={PAGES.DECKS}
        isLoggedIn={appState.isLoggedIn}
        appDispatch={appDispatch}
      />
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <h1>Notes</h1>
          <Link to="/notes/new">New Note</Link>
          <p>(...search and sort forthcoming)</p>

          {appState.paginatedNotes &&
            appState.paginatedNotes.map(({ content, id }) => (
              <TextDisplay key={id} text={content} />
            ))}
        </>
      )}
    </>
  );
};

export default Notes;
