import React from "react";
import {
  Button,
  GridContainer,
  Header,
  PrimaryNav,
} from "@trussworks/react-uswds";

const Review = ({ isLoggedIn, setIsLoggedIn }) => {
  const logOut = () => {
    localStorage.removeItem("mokkoAuthToken");
    setIsLoggedIn(false);
  };

  const navLinks = isLoggedIn
    ? [
        <Button type="button" onClick={logOut}>
          Log Out
        </Button>,
      ]
    : [<></>];

  return (
    <>
      <Header basic>
        <div className="usa-nav-container">
          <PrimaryNav items={navLinks} />
        </div>
      </Header>
      <GridContainer containerSize="desktop">
        <div>sup</div>
      </GridContainer>
    </>
  );
};

export default Review;
