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