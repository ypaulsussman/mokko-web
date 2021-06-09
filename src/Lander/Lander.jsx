import React from "react";
import { Link } from "react-router-dom";
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
      CRUD your <Link to="/decks">Decks</Link>, <Link to="/notes">Notes</Link>
      , or <Link to="/tags">Tags</Link>
    </p>
  </>
);

const Lander = ({ appState: { isLoggedIn }, appDispatch }) => {
  return (
    <div>
      <Header page="lander" isLoggedIn={isLoggedIn} appDispatch={appDispatch} />
      <h1>Welcome to Mokko!</h1>

      {isLoggedIn ? (
        <LanderLinks appDispatch={appDispatch} />
      ) : (
        <LanderIntro />
      )}
    </div>
  );
};

export default Lander;
