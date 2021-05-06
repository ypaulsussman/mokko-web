import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
            {/* @TODO: figure out how to redirect w/o hooks warnings */}
            {isLoggedIn ? (
              <Lander
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                upcomingNotes={upcomingNotes}
                setUpcomingNotes={setUpcomingNotes}
              />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )}
          </Route>
          <Route path="/review">
            <Review isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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
