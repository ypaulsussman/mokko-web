import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ACTIONS, API_URL, PAGES } from "../constants";
import { callAPI, getAllDecks, getAllTags } from "../utils";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import EditNote from "../shared/EditNote/EditNote";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";

const NewNote = ({ appState, appDispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  let history = useHistory();

  useEffect(() => {
    if (!appState.decks) {
      getAllDecks(appDispatch, setIsLoading, setError);
    }
  }, [appDispatch, appState.decks, setIsLoading, setError]);

  useEffect(() => {
    if (!appState.tags) {
      getAllTags(appDispatch, setIsLoading, setError);
    }
  }, [appDispatch, appState.tags, setIsLoading, setError]);

  const createNote = useCallback(
    (noteChanges) => {
      setIsLoading(true);
      callAPI(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("mokkoAuthToken"),
        },
        body: JSON.stringify(noteChanges),
      })
        .then((data) => {
          setIsLoading(false);
          appDispatch({
            type: ACTIONS.SET_NOTE,
            note: data.note,
            selectableDecks: data.selectable_decks,
            tags: data.tags,
          });
          appDispatch({
            type: ACTIONS.SET_REDIRECT_MESSAGE,
            message: "Note successfully created.",
          });

          history.push("/notes");
        })
        .catch(({ message }) => {
          setIsLoading(false);
          setError(message);
        });
    },
    [appDispatch, history]
  );

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
          <h1>Create Note</h1>
          {appState.decks && appState.tags ? (
            <EditNote
              isNewNote
              selectableDecks={appState.decks}
              tags={appState.tags}
              saveFunction={(noteChanges) => createNote(noteChanges)}
              cancelFunction={() => history.push("/notes")}
            />
          ) : null}
        </>
      )}
    </>
  );
};

export default NewNote;
