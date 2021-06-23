import React, { useEffect, useState } from "react";
import { buildConfirmMessage, callAPI } from "../utils";
import { ACTIONS, API_URL, PAGES } from "../constants";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import DeckRow from './DeckRow'

const Decks = ({ appState, appDispatch }) => {
  const [deckNameFilter, setDeckNameFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    callAPI(`${API_URL}/decks`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
    })
      .then((data) => {
        setIsLoading(false);
        appDispatch({
          type: ACTIONS.SET_DECKS,
          decks: data,
        });
      })
      .catch(({ message }) => {
        setIsLoading(false);
        setError(message);
      });
  }, [appDispatch]);

  const handleDeckDelete = ({ title, id, notes }) => {
    if (window.confirm(buildConfirmMessage(title, notes.length))) {
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

  const handleFilter = ({ target: { value } }) => {
    setDeckNameFilter(new RegExp(value, "i"));
  };

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
                    <DeckRow
                      key={deck.id}
                      deck={deck}
                      handleDeckDelete={handleDeckDelete}
                    />
                  ))
              : appState.decks.map((deck) => (
                  <DeckRow
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
