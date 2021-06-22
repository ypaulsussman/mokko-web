import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import marked from "marked";

import { useFetch } from "../utils";
import { ACTIONS, API_URL, PAGES, REQUEST_STATUS } from "../constants";
import { buildNotePreview } from "../utils";

import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";

const getDeleteMessage = (title, count) =>
  `Are you sure you want to delete the "${title}" deck? It'll also delete its ${count} associated notes.`;

const DeckRowDetails = ({ deck, handleDeckDelete }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div>
      <details>
        <summary>
          {deck.title}
          <button>Edit</button>
          <button onClick={() => handleDeckDelete(deck)}>Delete</button>
        </summary>
        <ul>
          {deck.notes.map((note) => (
            <li key={note.id}>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked(
                    DOMPurify.sanitize(buildNotePreview(note.content))
                  ),
                }}
              ></div>
              <Link to={`/note/${note.id}`}>Details</Link>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};

const Decks = ({ appState, appDispatch }) => {
  const [deckNameFilter, setDeckNameFilter] = useState("");
  // Fetch decks && associated notes; set in appReducer
  const [{ data, status, error }, makeRequest] = useFetch();
  const listReqOptions = useMemo(
    () => ({
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
    }),
    []
  );
  useEffect(() => {
    makeRequest({ url: `${API_URL}/decks`, opts: listReqOptions });
    if (data) {
      appDispatch({
        type: ACTIONS.SET_DECKS,
        decks: data,
      });
    }
  }, [appDispatch, data, listReqOptions, makeRequest]);

  // Handle delete-deck request
  const [
    { data: deletedDeck, status: deleteStatus, error: deleteError },
    makeDeleteRequest,
  ] = useFetch();
  const handleDeckDelete = ({ title, id, notes }) => {
    if (window.confirm(getDeleteMessage(title, notes.length))) {
      makeDeleteRequest({
        url: `${API_URL}/decks/${encodeURIComponent(id)}`,
        opts: {
          method: "DELETE",
          headers: {
            Authorization: sessionStorage.getItem("mokkoAuthToken"),
          },
        },
      });
    }
  };

  const handleFilter = ({ target: { value } }) =>
    setDeckNameFilter(new RegExp(value, "i"));

  return (
    <>
      {[status, deleteStatus].includes(REQUEST_STATUS.LOADING) && (
        <LoadingSpinner />
      )}
      <Header
        page={PAGES.DECKS}
        isLoggedIn={appState.isLoggedIn}
        appDispatch={appDispatch}
      />
      {/* @TODO: I hate this, even worse than the spinner logic.
          Find a way to abstract async status/error beyond the individual request-type. */}
      {[status, deleteStatus].includes(REQUEST_STATUS.ERROR) ? (
        <ErrorMessage
          message={`${error && "error:" + error} 
            ${deleteError && "deleteError:" + deleteError}`}
        />
      ) : (
        appState.decks && (
          <>
            <h1>Decks</h1>

            {deletedDeck && (
              <p>{`${deletedDeck.destroyed_deck} was deleted.`}</p>
            )}

            <label htmlFor="deckNameFilter">Filter by Deck Name:</label>
            <input
              type="text"
              name="deckNameFilter"
              id="deckNameFilter"
              onChange={handleFilter}
            />
            {deckNameFilter
              ? appState.decks
                  .filter(({ title }) => deckNameFilter.test(title))
                  .map((deck) => (
                    <DeckRowDetails
                      key={deck.id}
                      deck={deck}
                      handleDeckDelete={handleDeckDelete}
                    />
                  ))
              : appState.decks.map((deck) => (
                  <DeckRowDetails
                    key={deck.id}
                    deck={deck}
                    handleDeckDelete={handleDeckDelete}
                  />
                ))}
          </>
        )
      )}
    </>
  );
};

export default Decks;
