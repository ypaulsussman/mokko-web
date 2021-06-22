import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ACTIONS, API_URL, PAGES, REQUEST_STATUS } from "../constants";
import { getFormData, useFetch } from "../utils";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";

const Login = ({ appDispatch }) => {
  const [{ data, status, error }, makeRequest] = useFetch();
  const history = useHistory();

  const attemptLogin = (e) => {
    e.preventDefault();

    makeRequest({
      url: `${API_URL}/login`,
      opts: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getFormData()),
      },
    });
  };

  useEffect(() => {
    if (data?.auth_token) {
      sessionStorage.setItem("mokkoAuthToken", data.auth_token);
      appDispatch({ type: ACTIONS.LOG_IN });
      history.push("/");
    }
  }, [data, error, appDispatch, history]);

  return (
    <div>
      <Header
        page={PAGES.LOG_IN}
        isLoggedIn={false}
        appDispatch={appDispatch}
      />

      {status === REQUEST_STATUS.LOADING && <LoadingSpinner />}

      <h1>Sign In</h1>
      {error && <p>{error}</p>}
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
