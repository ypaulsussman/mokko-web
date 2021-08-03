import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ACTIONS, API_URL } from "../constants";
import { callAPI, getFormData } from "../utils";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";

const Login = ({ appDispatch }) => {
  const [loginFailed, setLoginFailed] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const attemptLogin = (e) => {
    e.preventDefault();

    const reqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getFormData()),
    };

    setIsLoading(true);
    callAPI(`${API_URL}/login`, reqOptions)
      .then(({ auth_token: authToken }) => {
        setIsLoading(false);
        sessionStorage.setItem("mokkoAuthToken", authToken);
        appDispatch({ type: ACTIONS.LOG_IN });
        history.push("/");
      })
      .catch(({ message }) => {
        setIsLoading(false);
        if (/^Code 401/.test(message)) {
          setLoginFailed("Looks like that combo's not recognized - try again?");
        } else {
          setLoginFailed(message);
        }
      });
  };

  return (
    <div>
      <Header isLoggedIn={false} appDispatch={appDispatch} />

      {isLoading && <LoadingSpinner />}

      {loginFailed && <p>{loginFailed}</p>}

      <h1 class="title is-1">Sign In</h1>
      <div className="columns">
        <form onSubmit={attemptLogin} className="column is-half">
          <div class="field">
            <label className="label" htmlFor="email">
              Email:
            </label>
            <input className="input" type="email" id="email" name="email" />
          </div>
          <div class="field">
            <label className="label" htmlFor="password">
              Password:
            </label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
            />
          </div>
          <button className="button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
