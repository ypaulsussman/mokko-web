import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { callAPI } from "../utils";
import { ACTIONS, API_URL } from "../constants";
import EditNote from "../shared/EditNote/EditNote";
import Header from "../shared/Header/Header";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ReadNote from "./ReadNote";

const Note = ({ appState, appDispatch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  let history = useHistory();
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
          note: data.note,
          selectableDecks: data.selectable_decks,
          tags: data.tags,
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
            note: data.note,
            selectableDecks: data.selectable_decks,
            tags: data.tags,
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          setError(message);
        });
    },
    [appDispatch, id]
  );

  const buildConfirmDeleteMsg = () => {
    const baseString = "Are you sure you want to delete this note?";
    const mokkoCount = appState.note.mokkos.length;
    if (mokkoCount) {
      return (
        baseString +
        ` It'll also delete ${mokkoCount} mokko${
          appState.note.mokkos.length > 1 ? "s" : ""
        }.`
      );
    } else {
      return baseString;
    }
  };
  const deleteNote = () => {
    if (window.confirm(buildConfirmDeleteMsg())) {
      setIsLoading(true);
      callAPI(`${API_URL}/notes/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          Authorization: sessionStorage.getItem("mokkoAuthToken"),
        },
      })
        .then(() => {
          setIsLoading(false);
          appDispatch({
            type: ACTIONS.SET_REDIRECT_MESSAGE,
            message: "Note successfully deleted.",
          });
          history.push("/");
        })
        .catch(({ message }) => {
          setError(message);
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Header isLoggedIn={appState.isLoggedIn} appDispatch={appDispatch} />
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        appState.note &&
        (isEditing ? (
          <EditNote
            note={appState.note}
            selectableDecks={appState.selectableDecks}
            tags={appState.tags}
            saveFunction={(noteChanges) => {
              updateNote(noteChanges);
              setIsEditing(false);
            }}
            cancelFunction={() => setIsEditing(false)}
          />
        ) : (
          <ReadNote
            deleteNote={deleteNote}
            note={appState.note}
            setIsEditing={setIsEditing}
          />
        ))
      )}
    </>
  );
};

export default Note;
