const axios = require("axios");
const apiUrl = "http://localhost:3000";

export const searchBusiness = data =>
  axios.post(`${apiUrl}/yelp/business/search`, data);

export const searchEvents = data =>
  axios.post(`${apiUrl}/yelp/events/search`, data);
  
export const searchPhone = data =>
  axios.post(`${apiUrl}/yelp/phone/search`, data);