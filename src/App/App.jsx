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

import { appReducer, initialAppState } from "./appReducer";
import "./App.css";

const App = () => {
  const [appState, appDispatch] = useReducer(appReducer, initialAppState);

  return (
    <div className="App">
      <Router>
        <Switch>
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
          <Route path="/">
            <Lander appState={appState} appDispatch={appDispatch} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
