// eslint-disable-next-line import/prefer-default-export
export const API_URL = process.env.NODE_ENV === "production"
  ? "https://mokko-api.herokuapp.com/api"
  : "http://localhost:5000/api";
