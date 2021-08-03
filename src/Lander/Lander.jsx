import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ACTIONS } from "../constants";
import Header from "../shared/Header/Header";

const LanderIntro = () => (
  <>
    <p class="subtitle is-3">(actual description of app goals goes here... later)</p>
  </>
);

const LanderLinks = () => (
  <div class="subtitle is-3">
    <p>
      Start <Link to="/review">Reflecting</Link>
    </p>
    <p>[ or ]</p>
    <p>
      CRUD your <Link to="/decks">Decks</Link>, <Link to="/notes">Notes</Link>,{" "}
      <del>
        or <Link to="/tags">Tags</Link>
      </del>{" "}
      (<i>not yet!</i>)
    </p>
  </div>
);

const Lander = ({ appState: { isLoggedIn, redirectMessage }, appDispatch }) => {
  // On unmount, clear any redirect message
  useEffect(() => {
    return () => {
      appDispatch({
        type: ACTIONS.SET_REDIRECT_MESSAGE,
        message: null,
      });
    };
  }, [appDispatch]);

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} appDispatch={appDispatch} />
      <h1 class="title is-1">Welcome to Mokko!</h1>

      {redirectMessage ? <p>{redirectMessage}</p> : null}

      {isLoggedIn ? <LanderLinks appDispatch={appDispatch} /> : <LanderIntro />}
    </div>
  );
};

export default Lander;
