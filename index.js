// Import modules
const express = require('express');
require('dotenv').config();

const cors = require('cors');

// Init express
const app = express();

app.use(cors());

// Import central routes
const routes = require('./routes/routes');

// Middleware: 
// --> Returns middleware that only parses JSON/urlencoded (needed for data sent via POST/PUT)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Link express to use main routes file 
app.use('/api', routes());

// PORT setup: Set server PORT as either one specified in config OR our default if not specified
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));