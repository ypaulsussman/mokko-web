import React from "react";
import { PAGES } from "../constants";
import Header from "../shared/Header/Header";

const Decks = ({appState, appDispatch}) => {
  
  return (
    <>
      <Header
        page={PAGES.DECKS}
        isLoggedIn={appState.isLoggedIn}
        appDispatch={appDispatch}
      />
      <div>sup; it's decks</div>
    </>
  )
}

export default Decks;
