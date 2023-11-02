const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const apiKey = process.env.APIKEY;
const apiUrl = "https://api.yelp.com/v3/businesses/search";
const apiUrl2 = "https://api.yelp.com/v3/businesses";
const apiUrl3 =
  "https://api.yelp.com/v3/businesses/{business_id_or_alias}/reviews";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/yelp/businesses", async (req, res) => {
  try {
    const response = await axios.get(apiUrl, {
      params: req.query,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/yelp/businesses/:id", async (req, res) => {
  try {
    const businessId = req.params.id;
    const response = await axios.get(`${apiUrl2}/${businessId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/yelp/businesses/:id/reviews", async (req, res) => {
  try {
    const businessId = req.params.id;
    const reviewsUrl = apiUrl3.replace("{business_id_or_alias}", businessId);
    const response = await axios.get(reviewsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
