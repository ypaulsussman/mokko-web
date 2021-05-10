import React, { useMemo } from "react";
import Header from "../shared/Header/Header";
import { useFetch } from "../utils";
import { API_URL } from "../constants";

const Review = ({ isLoggedIn, setIsLoggedIn, upcomingNotes }) => {
  const url = `${API_URL}/notes/review`;
  const reqOptions = useMemo(
    () => ({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("mokkoAuthToken"),
      },
      body: JSON.stringify(upcomingNotes),
    }),
    [upcomingNotes]
  );

  // @TODO: add loading spinner
  const { data } = useFetch(url, reqOptions);
  console.log("data: ", data);

  return (
    <div>
      <Header
        page="review"
        isLoggedIn={{ isLoggedIn }}
        setIsLoggedIn={setIsLoggedIn}
      />

        <p>sup</p>
    </div>
  );
};

export default Review;
