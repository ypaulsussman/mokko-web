import React from "react";
import { Link } from "react-router-dom";

const ErrorMessage = ({ message }) => (
  <>
    <h1>Huh. Something's gone wrong.</h1>
    <p>The server tells us the following:</p>
    <p>{message}</p>
    <p>
      From here, I'd probably just <Link to="/">head back</Link> to the lander.
    </p>
  </>
);

export default ErrorMessage;
