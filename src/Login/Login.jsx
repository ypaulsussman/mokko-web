import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
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
    <Container fluid="lg">
      <Header
        page="login"
        isLoggedIn={false}
        setIsLoggedIn={ setIsLoggedIn }
      />

      <Row lg={{ span: 6, offset: 3 }}>
        {loginFailed && (
          <Alert variant="warning" dismissible>
            Looks like that combo&apos;s not recognized - try again?
          </Alert>
        )}
        <h1>Sign in</h1>
        <Form onSubmit={attemptLogin}>
          <Form.Group>
            <Form.Label htmlFor="email">Email:</Form.Label>
            <Form.Control type="email" id="email" name="email" />
            <Form.Label htmlFor="password">Password:</Form.Label>
            <Form.Control type="password" id="password" name="password" />
            <Button type="submit">Sign in</Button>
          </Form.Group>
        </Form>
      </Row>
    </Container>
  );
};

export default Login;
