import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Alert,
  Button,
  Form,
  Fieldset,
  GridContainer,
  Header,
  Label,
  PrimaryNav,
  TextInput,
} from "@trussworks/react-uswds";
import { API_URL } from "../constants";
import { callAPI, getFormData } from "../utils";

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
    <>
      <Header basic>
        <div className="usa-nav-container">
          <PrimaryNav items={[<Link to="/">Home</Link>]} />
        </div>
      </Header>
      <GridContainer containerSize="desktop">
        {loginFailed && (
          <Alert type="warning" slim>
            Looks like that combo&apos;s not recognized - try again?
          </Alert>
        )}
        <Form onSubmit={attemptLogin} large>
          <Fieldset legend="Sign In" legendStyle="large">
            <Label htmlFor="email">Email:</Label>
            <TextInput id="email" name="email" type="text" />
            <Label htmlFor="password">Password:</Label>
            <TextInput id="password" name="password" type="password" />
            <Button type="submit">Sign in</Button>
          </Fieldset>
        </Form>
      </GridContainer>
    </>
  );
};

export default Login;
