export const ACTIONS = {
  LOG_IN: "LOG_IN",
  LOG_OUT: "LOG_OUT",
  MOKKO_SUCCESS: "MOKKO_SUCCESS",
  SET_DECKS: "SET_DECKS",
  SET_MOKKOSTATUS: "SET_MOKKOSTATUS",
  SET_NOTE: "SET_NOTE",
  SET_NOTES: "SET_NOTES",
  SET_REDIRECT_MESSAGE: "SET_REDIRECT_MESSAGE",
  SET_REVIEW_NOTES: "SET_REVIEW_NOTES",
  SET_TAGS: "SET_TAGS",
};

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://peaceful-caverns-97846.herokuapp.com/api"
    : "http://localhost:5000/api";

export const BASE_INTERVALS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

export const NOTE_PREVIEW_LENGTH = 48;

export const REQUEST_STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};
