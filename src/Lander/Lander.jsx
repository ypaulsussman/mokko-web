import React from "react";
import Header from "../shared/Header/Header";
import Overview from './Overview'
import Welcome from './Welcome'

const Lander = ({ appState: { upcomingNotes }, appDispatch }) => {
  return (
    <div>
      <Header page="lander" appDispatch={appDispatch} />

      {sessionStorage.getItem("mokkoAuthToken") ? (
        <Overview upcomingNotes={upcomingNotes} appDispatch={appDispatch} />
      ) : (
        <Welcome />
      )}
    </div>
  );
};

export default Lander;
