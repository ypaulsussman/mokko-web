import React, { useReducer } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation,
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

const Routing = () => {
  const [appState, appDispatch] = useReducer(appReducer, initialAppState);
  const location = useLocation();

  return (
    <div className="columns is-centered">
      <div
        className={`column ${
          location.pathname === "/review" ? "is-full" : "is-two-thirds"
        }`}
      >
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
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Routing />
  </Router>
);
export default App;
