// BLOG SERVER TOOLS
// Import general modules
const express = require('express');
const router = express.Router();
require('dotenv').config();

// Import HTTP request structuring module
// NOTE: No longer using request to structure our HTTP POST request
const axios = require('axios');

// [A5] POST Request Auth Params required by MailChimp API (stored in envs)
const getRequestParams = (email) => {
  // Store env auth variables 
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;

  // "Fancy" way of spliting off the "us8" part off our API key
  const DATACENTER = process.env.MAILCHIMP_API_KEY.split("-")[1];

  // Form the API POST url by concatening the default url with the datacenter & list ID
  // NOTE: In MailChimp - "lists" are now referred to as "audiences"
  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  // Stores our form data in the MailChimp structure
  const data = {
    email_address: email,
    status: 'subscribed',
  };

  // API Key is encoded into a "base 64" format (required by MailChimp)
  // NOTE: base 64 format is a type of encoding to make binary data survive transport layers like mail bodies
  const base64ApiKey = Buffer.from(`anystring:${API_KEY}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${base64ApiKey}`,
  };

  return {
    url,
    data,
    headers,
  };
}

// Setup BLOG route in export function
module.exports = () => {
  // Blog Subscription Submit POST route
  router.post('/', async (req, res) => {
    // [A4] Form post processing & validation

    // Check our submitted form data & store in variable
    console.log(req.body);
    const { email } = req.body

    // Validation handling for incorrect form submission (store an error message for use on client-side)
    if (!email || !email.length){
      res.status(400).json({
        error: "Oops! You need to enter an email - please try again!"
      });
      return;
    };

    // [A6] POST Request Setup to hit MailChimp API
    try {
      // Destructure the returned method properties for use
      const { url, data, headers } = getRequestParams(email);

      // Post request to MailChimp - passing in all data required by its' API auth
      const response = await axios.post(url, data, { headers });

      // Success response
      return res.status(201).send('Thank you for subscribing to the AB Programming Blog!')

      // Error response
    } catch (error) {
      return res.status(400).json({
        error: `Oops, something went wrong - please try again later!`
      });
    }
  })

  return router
};