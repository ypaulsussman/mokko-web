import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { callAPI } from "../utils";
import { ACTIONS, API_URL, PAGES } from "../constants";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import { NoteDetails, TextDisplay } from "../Review/Detail";

const Note = ({ appState, appDispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  let { id } = useParams();
  const getNote = useCallback(() => {
    setIsLoading(true);
    callAPI(`${API_URL}/notes/${id}`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
    })
      .then((data) => {
        setIsLoading(false);
        appDispatch({
          type: ACTIONS.SET_NOTE,
          note: data,
        });
      })
      .catch(({ message }) => {
        setIsLoading(false);
        setError(message);
      });
  }, [appDispatch, id]);

  useEffect(() => getNote(), [getNote]);

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
        appState.note && (
          <>
            <h1>Note:</h1>
            <TextDisplay text={appState.note.content} />
            <NoteDetails note={appState.note} />
            <button>Edit</button>
            <button>Delete</button>
          </>
        )
      )}
    </>
  );
};

export default Note;
