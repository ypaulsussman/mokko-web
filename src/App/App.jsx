import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Login from "../Login/Login";
import Lander from "../Lander/Lander";
import Review from "../Review/Review";

import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("mokkoAuthToken"))
  );
  const [upcomingNotes, setUpcomingNotes] = useState({
    today: [],
    tomorrow: [],
    restOfWeek: [],
  });

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login">
            {isLoggedIn ? (
              <Redirect to="/" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )}
          </Route>
          <Route path="/review">
            {isLoggedIn ? (
              <Review
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                upcomingNotes={upcomingNotes}
              />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/">
            <Lander
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              upcomingNotes={upcomingNotes}
              setUpcomingNotes={setUpcomingNotes}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
