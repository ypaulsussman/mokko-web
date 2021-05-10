import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { API_URL } from "../constants";
import { callAPI, getFormData } from "../utils";
import Header from "../shared/Header/Header";

const Login = ({ setIsLoggedIn }) => {
  const [loginFailed, setLoginFailed] = useState("");
  const history = useHistory();

  const attemptLogin = (e) => {
    e.preventDefault();

    const reqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getFormData()),
    };

    callAPI(`${API_URL}/login`, reqOptions)
      .then(({ auth_token: authToken }) => {
        localStorage.setItem("mokkoAuthToken", authToken);
        setIsLoggedIn(true);
        history.push("/");
      })
      .catch((error) => {
        setLoginFailed(error);
      });
  };

  return (
    <div>
      <Header page="login" isLoggedIn={false} setIsLoggedIn={setIsLoggedIn} />

      {loginFailed && (
        <p>Looks like that combo&apos;s not recognized - try again?</p>
      )}
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
