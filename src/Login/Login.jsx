import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ACTIONS, API_URL } from "../constants";
import { callAPI, getFormData } from "../utils";
import Header from "../shared/Header/Header";

const Login = ({ appDispatch }) => {
  const [loginFailed, setLoginFailed] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory();

  const attemptLogin = (e) => {
    e.preventDefault();

    const reqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getFormData()),
    };

    setIsLoading(true)
    callAPI(`${API_URL}/login`, reqOptions)
      .then(({ auth_token: authToken }) => {
        setIsLoading(false)
        localStorage.setItem("mokkoAuthToken", authToken);
        appDispatch({ type: ACTIONS.LOG_IN });
        history.push("/");
      })
      .catch((error) => {
        setIsLoading(false)
        if (/^Code 401/.test(error)) {
          setLoginFailed("Looks like that combo's not recognized - try again?");
        } else {
          setLoginFailed(error);
        }
      });
  };

  return (
    <div>
      <Header page="login" isLoggedIn={false} appDispatch={appDispatch} />

      {isLoading && <p>LOADING SPINNER</p>}

      {loginFailed && <p>{loginFailed}</p>}

      <h1>Sign In</h1>
      <form onSubmit={attemptLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
