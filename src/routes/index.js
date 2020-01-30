const express = require('express');
const app = express();

// ----- Import all routes here -----
const registryRoute = require('./registry');
const deviceRoute = require('./device');

// ----- Use all routes here -----
app.use(registryRoute);
app.use(deviceRoute);

// Export main router to use it in the main app.
module.exports = app;
