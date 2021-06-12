// MAIN ROUTING FILE:
// Import modules
const express = require('express');
const router = express.Router();

// Import sub-routes:
const contact = require('./contact');
const blog = require('./blog');

// Setup HOME route and SUB routes in export function
module.exports = () => {
  // [A] Home Routes
  router.get('/', (req, res) => {
    res.send('Hello from the server')
  });

  // [B] Sub-Routes
  router.use('/contact', contact());
  router.use('/blog', blog());

  return router;
};