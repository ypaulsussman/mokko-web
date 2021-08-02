import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ACTIONS } from "../../constants";

const Header = ({ appDispatch, extraLinks, isLoggedIn }) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const history = useHistory();
  const logOut = () => {
    sessionStorage.removeItem("mokkoAuthToken");
    appDispatch({ type: ACTIONS.LOG_OUT });
    history.push("/");
  };

  const navItems = [];

  extraLinks &&
    extraLinks.forEach(({ text, url }) =>
      navItems.push(
        <Link
          className={`navbar-item ${isBurgerOpen ? "is-tab" : ""}`}
          key={url}
          to={url}
        >
          {text}
        </Link>
      )
    );

  window.location.pathname !== "/" &&
    navItems.push(
      <Link
        className={`navbar-item ${isBurgerOpen ? "is-tab" : ""}`}
        key="home-link"
        to="/"
      >
        Home
      </Link>
    );

  isLoggedIn &&
    navItems.push(
      <Link
        className={`navbar-item ${isBurgerOpen ? "is-tab" : ""}`}
        key="logout-link"
        to="/"
        onClick={logOut}
      >
        Log Out
      </Link>
    );

  !isLoggedIn &&
    navItems.push(
      <Link
        className={`navbar-item ${isBurgerOpen ? "is-tab" : ""}`}
        key="login-link"
        to="/login"
      >
        Log In
      </Link>
    );

  return (
    <header>
      <button
        className={`navbar-burger ${isBurgerOpen ? "is-active" : ""}`}
        aria-label="Expand Menu"
        aria-expanded={isBurgerOpen}
        onClick={() => setIsBurgerOpen(!isBurgerOpen)}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>

      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className={`navbar-menu ${isBurgerOpen ? "is-active" : ""}`}>
          <div className="navbar-end">{navItems}</div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
