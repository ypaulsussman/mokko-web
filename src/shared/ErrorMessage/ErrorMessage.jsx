import React from "react";
import { Link } from "react-router-dom";

const ErrorMessage = ({ message }) => (
  <>
    <h1>Huh. Something's gone wrong.</h1>
    <h2>The server tells us the following:</h2>
    <p>{message}</p>
    <h2>
      From here, I'd probably just <Link to="/">head back</Link> to the lander.
    </h2>
  </>
);

export default ErrorMessage;
