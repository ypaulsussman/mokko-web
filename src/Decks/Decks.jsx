import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import marked from "marked";

import { callAPI, useFetch } from "../utils";
import { ACTIONS, API_URL, PAGES, REQUEST_STATUS } from "../constants";
import { buildNotePreview } from "../utils";

import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";

const DECK_LIST_URL = `${API_URL}/decks`;
const useDeckListOpts = () =>
  useMemo(
    () => ({
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
    }),
    []
  );

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
  const [isLoading, setIsLoading] = useState(false);

  const handleFilter = ({ target: { value } }) => {
    setDeckNameFilter(new RegExp(value, "i"));
  };

  const handleDeckDelete = ({ title, id, notes }) => {
    const message = `Are you sure you want to delete the "${title}" deck? It'll also delete its ${notes.length} associated notes.`;
    if (window.confirm(message)) {
      setIsLoading(true);
      callAPI(`${API_URL}/decks/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          Authorization: sessionStorage.getItem("mokkoAuthToken"),
        },
      })
        .then(({ destroyed_deck: destroyedDeck }) => {
          console.log("destroyed: ", destroyedDeck);
          setIsLoading(false);
        })
        .catch(({ message }) => {
          console.log("error message: ", message);
        });
    }
  };

  // Fetch decks && associated notes; set in appReducer
  const { data, status, error } = useFetch(DECK_LIST_URL, useDeckListOpts());
  useEffect(() => {
    if (data) {
      appDispatch({
        type: ACTIONS.SET_DECKS,
        decks: data,
      });
    }
  }, [data, appDispatch]);

  return (
    <>
      {(status === REQUEST_STATUS.LOADING || isLoading) && <LoadingSpinner />}
      <Header
        page={PAGES.DECKS}
        isLoggedIn={appState.isLoggedIn}
        appDispatch={appDispatch}
      />
      {status === REQUEST_STATUS.ERROR ? (
        <ErrorMessage message={error} />
      ) : (
        appState.decks && (
          <>
            <h1>Decks</h1>
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
