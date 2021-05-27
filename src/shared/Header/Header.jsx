import React from "react";
import { Link } from "react-router-dom";
import { ACTIONS, PAGES } from "../../constants";

const Header = ({ page, appDispatch }) => {
  const logOut = () => {
    sessionStorage.removeItem("mokkoAuthToken");
    appDispatch({ type: ACTIONS.LOG_OUT });
  };

  const navItems = [];

  [PAGES.LOGIN, PAGES.REVIEW].includes(page) &&
    navItems.push(
      <Link key="home-link" to="/">
        Home
      </Link>
    );

    sessionStorage.getItem("mokkoAuthToken") &&
    navItems.push(
      <Link key="logout-link" to="/" onClick={logOut}>
        Log Out
      </Link>
    );

  page === PAGES.LANDER &&
    !sessionStorage.getItem("mokkoAuthToken") &&
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
