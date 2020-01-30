const express = require('express');
const expressConfig = require('./config/express');
const cors = require('cors')({
  origin: true,
});

// Create the express app and load all middlewares and configurations.
const deviceControlApi = express();

deviceControlApi.use(cors);
expressConfig(deviceControlApi);

module.exports = {
  deviceControlApi,
};
