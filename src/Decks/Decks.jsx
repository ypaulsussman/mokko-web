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

const buildDeckHTML = (deck) => (
  <div key={deck.id}>
    <details>
      <summary>{deck.title}</summary>
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

const Decks = ({ appState, appDispatch }) => {
  const [deckNameFilter, setDeckNameFilter] = useState("");

  const handleFilter = ({ target: { value } }) => {
    setDeckNameFilter(new RegExp(value, "i"));
  };

  // Fetch decks && associated notes; set in appReducer
  const url = `${API_URL}/decks`;
  const reqOptions = useMemo(
    () => ({
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
    }),
    []
  );

  const { data, status, error } = useFetch(url, reqOptions);
  useEffect(() => {
    if (data) {
      console.log("data: ", data);
      appDispatch({
        type: ACTIONS.SET_DECKS,
        decks: data,
      });
    }
  }, [data, appDispatch]);

  return (
    <>
      {status === REQUEST_STATUS.LOADING && <LoadingSpinner />}
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
                  .map(buildDeckHTML)
              : appState.decks.map(buildDeckHTML)}
          </>
        )
      )}
    </>
  );
};

export default Decks;
