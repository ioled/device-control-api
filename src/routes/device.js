const express = require('express');
const router = express.Router();
const mongoService = require('../services/mongodb');

// Import all controllers for devices control
const {
  getDevices,
  getDeviceState,
  getDeviceConfig,
  updateDeviceConfig,
  getUserByDevice,
  getDeviceLastConfig,
  getDeviceLastState,
} = require('../controllers/device');

// Router middleware to handle devices routes.
router.route('/devices').get(getDevices);

router.route('/device/:id/state').get(getDeviceLastState);

router.route('/device/:id/config').get(getDeviceLastConfig);

router.route('/device/:id').put(updateDeviceConfig);

router.route('/device/:id/user').get(getUserByDevice);

router.route('/device/:id/state-history').get(getDeviceState);

router.route('/device/:id/config-history').get(getDeviceConfig);

// Export router to use it in the main router.
module.exports = router;
