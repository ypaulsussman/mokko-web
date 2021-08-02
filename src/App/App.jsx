import React, { useReducer } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Login from "../Login/Login";
import Lander from "../Lander/Lander";
import Review from "../Review/Review";
import Decks from "../Decks/Decks";
import Notes from "../Notes/Notes";
import NewNote from "../NewNote/NewNote";
import NoteDetail from "../NoteDetail/NoteDetail";

import { appReducer, initialAppState } from "./appReducer";
import "./App.scss";

const App = () => {
  const [appState, appDispatch] = useReducer(appReducer, initialAppState);

  return (
    <div className="columns is-centered">
      <div className="column is-two-thirds">
        <Router>
          <Switch>
            {/* @TODO: there's got to be a cleaner way to do client-side redirects */}
            <Route path="/login">
              {appState.isLoggedIn ? (
                <Redirect to="/" />
              ) : (
                <Login appDispatch={appDispatch} />
              )}
            </Route>
            <Route path="/review">
              {appState.isLoggedIn ? (
                <Review appState={appState} appDispatch={appDispatch} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route path="/decks">
              {appState.isLoggedIn ? (
                <Decks appState={appState} appDispatch={appDispatch} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route path="/notes/new">
              {appState.isLoggedIn ? (
                <NewNote appState={appState} appDispatch={appDispatch} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route path="/notes/:id">
              {appState.isLoggedIn ? (
                <NoteDetail appState={appState} appDispatch={appDispatch} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route path="/notes">
              {appState.isLoggedIn ? (
                <Notes appState={appState} appDispatch={appDispatch} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route path="/">
              <Lander appState={appState} appDispatch={appDispatch} />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default App;
