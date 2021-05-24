import React from "react";
import Header from "../shared/Header/Header";
import Overview from './Overview'
import Welcome from './Welcome'

const Lander = ({ appState: { isLoggedIn, upcomingNotes }, appDispatch }) => {
  return (
    <div>
      <Header page="lander" isLoggedIn={isLoggedIn} appDispatch={appDispatch} />

      {isLoggedIn ? (
        <Overview upcomingNotes={upcomingNotes} appDispatch={appDispatch} />
      ) : (
        <Welcome />
      )}
    </div>
  );
};

export default Lander;
