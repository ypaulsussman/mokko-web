import React, { useCallback, useEffect, useState } from "react";
import { buildConfirmMessage, callAPI, getFormData } from "../utils";
import { ACTIONS, API_URL, PAGES } from "../constants";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import DeckRow from "./DeckRow";

const Decks = ({ appState, appDispatch }) => {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deckTitleFilter, setDeckTitleFilter] = useState("");
  const [destroyedDeck, setDestroyedDeck] = useState("");
  const getAllDecks = useCallback(() => {
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

  useEffect(() => getAllDecks(), [getAllDecks]);

  const handleDeckDelete = ({ title, id, notes }) => {
    if (window.confirm(buildConfirmMessage(title, notes.length))) {
      setIsLoading(true);
      callAPI(`${API_URL}/decks/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          Authorization: sessionStorage.getItem("mokkoAuthToken"),
        },
      })
        .then(({ destroyed_deck }) => {
          setDestroyedDeck(destroyed_deck);
          setIsLoading(false);
          getAllDecks();
        })
        .catch(({ message }) => {
          setError(message);
          setIsLoading(false);
        });
    }
  };

  const handleDeckTitleSubmit = (newDeckTitle, id, newDeck = false) => {
    setIsLoading(true);
    callAPI(`${API_URL}/decks/${encodeURIComponent(id)}`, {
      method: newDeck ? "POST" : "PUT",
      headers: {
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newDeckTitle }),
    })
      .then(() => {
        setIsLoading(false);
        getAllDecks();
      })
      .catch(({ message }) => {
        setError(message);
        setIsLoading(false);
      });
  };

  const handleFilter = ({ target: { value } }) => {
    setDeckTitleFilter(new RegExp(value, "i"));
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
            {isCreateMode ? (
              <form name="newDeck">
                <label htmlFor="deckTitle">New Deck Title:</label>
                <input type="text" name="deckTitle" id="deckTitle" />

                <button onClick={() => setIsCreateMode(false)}>Cancel</button>
                <button
                  type="submit"
                  onClick={() => {
                    handleDeckTitleSubmit(
                      getFormData('form[name="newDeck"]').deckTitle,
                      "",
                      true
                    );
                    setIsCreateMode(false);
                  }}
                >
                  Save
                </button>
              </form>
            ) : (
              <button onClick={() => setIsCreateMode(true)}>Add Deck</button>
            )}
            {destroyedDeck && (
              <p>{`The "${destroyedDeck}" deck was deleted.`}</p>
            )}
            <label htmlFor="deckTitleFilter">Filter by Deck Title:</label>
            <input
              type="text"
              name="deckTitleFilter"
              id="deckTitleFilter"
              onChange={handleFilter}
            />
            {deckTitleFilter
              ? appState.decks
                  .filter(({ title }) => deckTitleFilter.test(title))
                  .map((deck) => (
                    <DeckRow
                      key={deck.id}
                      deck={deck}
                      handleDeckDelete={handleDeckDelete}
                      handleDeckTitleSubmit={handleDeckTitleSubmit}
                    />
                  ))
              : appState.decks.map((deck) => (
                  <DeckRow
                    key={deck.id}
                    deck={deck}
                    handleDeckDelete={handleDeckDelete}
                    handleDeckTitleSubmit={handleDeckTitleSubmit}
                  />
                ))}
          </>
        )
      )}
    </>
  );
};

export default Decks;
