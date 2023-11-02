import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3000/api/yelp/businesses",
  headers: {
    Authorization: import.meta.env.VITE_API_KEY,
  },
});
