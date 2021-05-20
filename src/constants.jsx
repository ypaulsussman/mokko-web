export const API_URL = process.env.NODE_ENV === "production"
  ? "https://mokko-api.herokuapp.com/api"
  : "http://localhost:5000/api";

export const BASE_INTERVALS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
