import axios from "axios";

export const API = axios.create({
  baseURL:
    "https://62teknologi-frontend-test-angga-nur-ardiansyah-6i0pqeya1.vercel.app/api/yelp/businesses",
  headers: {
    Authorization: import.meta.env.VITE_API_KEY,
  },
});
