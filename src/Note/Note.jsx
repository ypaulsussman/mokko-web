import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { callAPI } from "../utils";
import { ACTIONS, API_URL, PAGES } from "../constants";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import { EditNote, ReadNote } from "./Detail";

const Note = ({ appState, appDispatch }) => {
  const [isEditing, setIsEditing] = useState(false);
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

  const updateNote = useCallback(
    (noteChanges) => {
      setIsLoading(true);
      callAPI(`${API_URL}/notes/${id}`, {
        method: "PUT",
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
            note: data,
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          setError(message);
        });
    },
    [appDispatch, id]
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
        appState.note &&
        (isEditing ? (
          <EditNote
            note={appState.note}
            setIsEditing={setIsEditing}
            updateNote={updateNote}
          />
        ) : (
          <ReadNote note={appState.note} setIsEditing={setIsEditing} />
        ))
      )}
    </>
  );
};

export default Note;
