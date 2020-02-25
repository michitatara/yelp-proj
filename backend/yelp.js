{
    "presets": [
        "@babel/preset-env"
    ]
}
The config will let us run our app using Babel Node instead of regular Node.js, which supports the latest JavaScript features. We will also need to install nodemon to watch for changes in our files and reload when we develop the app.
Next we can write our business logic. We need routes to request data using the frontend and send it to the Yelp API, and then return the results from the Yelp API as JSON. Create a file called yelp.js and add the following code:
const express = require("express");
const router = express.Router();
const yelpApiUrl = "https://api.yelp.com/v3/graphql";
import { GraphQLClient } from "graphql-request";
const client = new GraphQLClient(yelpApiUrl, {
  headers: { Authorization: `Bearer ${process.env.YELP_API_KEY}` },
});
/* GET users listing. */
router.post("/business/search", async (req, res, next) => {
  const query = `
    query search($term: String!, $location: String!, $offset: Int!) {
      search(
        term: $term,
        location: $location,
        offset: $offset
      ) {
      total
      business {
        name
        rating
        review_count
        hours {
          is_open_now
          open {
            start
            end
            day
          }
        }
        location {
          address1
          city
          state
          country
        }
      }
    }
  }`;
  const data = await client.request(query, req.body);
  res.json(data);
});
router.post("/events/search", async (req, res, next) => {
  const query = `
    query event_search($location: String!, $offset: Int!) {
      event_search(
        location: $location,
        offset: $offset
      ) {
      total
      events {
        name
        cost
        cost_max
      }
    }
  }`;
  const data = await client.request(query, req.body);
  res.json(data);
});
router.post("/phone/search", async (req, res, next) => {
  const query = `
    query phone_search($phone: String!) {
      phone_search(
        phone: $phone
      ) {
      total
      business {
        name
        rating
        review_count
        location {
          address1
          city
          state
          country
        }
        hours {
          is_open_now
          open {
            start
            end
            day
          }
        }
      }
    }
  }`;
  const data = await client.request(query, req.body);
  res.json(data);
});
module.exports = router;