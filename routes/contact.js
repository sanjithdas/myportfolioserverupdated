// CONTACT ROUTE
// Import modules
const express = require('express');
const router = express.Router();

require('dotenv').config();
const nodemailer = require('nodemailer');

// Setup CONTACT route in export function
module.exports = () => {
  // [A] Contact Submit POST route
  router.post('/', (req, res ) => {
    console.log(req.body);
    
    if (!req.body.name || !req.body.email || !req.body.message ){
      res.status(400).send('Please ensure all fields have been filled out');
      return;
    }
    
    // Store the form data inside a custom message
    const output = `
      <p>You have a NEW Contact message</p>
      <h3>Contact Details:</h3>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email address: ${req.body.email}</li>
      </ul>
      <h3> Message text: </h3>
      <p>${req.body.message}</p>
    `;
    console.log(output)
  
    // Create Transporter object 
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        pass: process.env.PASS,
        // To obtain below - we need to configure our Google Cloud API & OAuth2 Playground settings
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      }
    });
    
    // Create mailOptions object
    let mailOptions = {
      from: req.body.email, 
      // NOTE: Ensure you change this to whichever email you want to receive your test emails!
      to: process.env.EMAIL, 
      subject: 'Node contact request',
      html: output
    }
    
    // Use sendMail method (send email message)
    transporter.sendMail(mailOptions, (error, info) => {
      console.log('Sending email...');
      if(error) {
        console.log(error);
        res.status(400).send('Oops something went wrong: ' + error);
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log('Email sent. Success');
        res.status(200).send('Email sent successfully');
      }
    })
  });

  return router
};