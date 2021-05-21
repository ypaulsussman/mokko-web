import React from "react";
import { Link } from "react-router-dom";
import { ACTIONS } from "../../constants";

const Header = ({ page, isLoggedIn, appDispatch }) => {
  const logOut = () => {
    localStorage.removeItem("mokkoAuthToken");
    appDispatch({ type: ACTIONS.LOG_OUT });
  };

  const navItems = [];

  ["login", "review"].includes(page) &&
    navItems.push(
      <Link key="home-link" to="/">
        Home
      </Link>
    );

  isLoggedIn &&
    navItems.push(
      <Link key="logout-link" to="/" onClick={logOut}>
        Log Out
      </Link>
    );

  page === "lander" &&
    !isLoggedIn &&
    navItems.push(
      <Link key="logout-link" to="/login">
        Log In
      </Link>
    );

  return (
    <header>
      <nav>{navItems}</nav>
    </header>
  );
};

export default Header;
