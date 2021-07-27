import React, { useState } from "react";
import { PAGES } from "../constants";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";

const NewNote = ({ appState, appDispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
          <p>you're rendering now</p>
        </>
      )}
    </>
  );
};

export default NewNote;
