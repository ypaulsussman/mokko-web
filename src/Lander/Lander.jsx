import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ACTIONS, PAGES } from "../constants";
import Header from "../shared/Header/Header";

const LanderIntro = () => (
  <>
    <p>(actual description of app goals goes here... later)</p>
  </>
);

const LanderLinks = () => (
  <>
    <p>
      Start <Link to="/review">Reflecting</Link>
    </p>
    <p>[ or ]</p>
    <p>
      CRUD your <Link to="/decks">Decks</Link>, <Link to="/notes">Notes</Link>,
      or <Link to="/tags">Tags</Link>
    </p>
  </>
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
      <Header
        page={PAGES.LANDER}
        isLoggedIn={isLoggedIn}
        appDispatch={appDispatch}
      />
      <h1>Welcome to Mokko!</h1>

      {redirectMessage ? <p>{redirectMessage}</p> : null}
      
      {isLoggedIn ? <LanderLinks appDispatch={appDispatch} /> : <LanderIntro />}
    </div>
  );
};

export default Lander;
