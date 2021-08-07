import React, { useEffect, useState } from "react";
import { callAPI, getAllDecks, getFormData } from "../utils";
import { API_URL } from "../constants";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import DeckRow from "./DeckRow";

const Decks = ({ appState, appDispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deckTitleFilter, setDeckTitleFilter] = useState("");
  const [destroyedDeck, setDestroyedDeck] = useState("");

  useEffect(
    () => getAllDecks(appDispatch, setIsLoading, setError),
    [appDispatch, setIsLoading, setError]
  );

  const buildConfirmDeleteMsg = (title, count) =>
    `Are you sure you want to delete the "${title}" deck? It'll also delete its ${count} associated notes.`;

  const handleDeckDelete = ({ title, id, notes }) => {
    if (window.confirm(buildConfirmDeleteMsg(title, notes.length))) {
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
          getAllDecks(appDispatch, setIsLoading, setError);
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
        getAllDecks(appDispatch, setIsLoading, setError);
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
      <Header isLoggedIn={appState.isLoggedIn} appDispatch={appDispatch} />
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        appState.decks && (
          <>
            <h1 className="title is-1">Decks</h1>

            {destroyedDeck && (
              <p className="mb-4">{`The "${destroyedDeck}" deck was deleted.`}</p>
            )}

            <form
              name="newDeck"
              className="column mt-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <label
                htmlFor="deckTitle"
                className="label mr-2 mb-0"
                style={{ flexShrink: 0 }}
              >
                Add New Deck:
              </label>
              <input
                type="text"
                name="deckTitle"
                id="deckTitle"
                className="input mr-4"
                style={{ maxWidth: "33%" }}
              />
              <button
                className="button is-outlined"
                type="button"
                onClick={() => {
                  handleDeckTitleSubmit(
                    getFormData('form[name="newDeck"]').deckTitle,
                    "",
                    true
                  );
                }}
              >
                Save
              </button>
            </form>

            <div
              className="column mb-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <label
                htmlFor="deckTitleFilter"
                className="label mr-2 mb-0"
                style={{ flexShrink: 0 }}
              >
                Filter by Deck:
              </label>
              <input
                className="input"
                type="text"
                name="deckTitleFilter"
                id="deckTitleFilter"
                onChange={handleFilter}
                style={{ maxWidth: "33%" }}
              />
            </div>

            <hr style={{ height: "1px", backgroundColor: "darkgray" }} />

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
