const express = require('express');
const router = express.Router();

// Import all controllers for devices control
const {
  getDeviceState,
  getDeviceConfig,
  updateDeviceConfig,
  getDeviceLastConfig,
  getDeviceLastState,
} = require('../controllers/device');

// Router middleware to handle devices routes.
router.route('/device/:id/state').get(getDeviceLastState);

router.route('/device/:id/config').get(getDeviceLastConfig);

router.route('/device/:id').put(updateDeviceConfig);

router.route('/device/:id/state-history').get(getDeviceState);

router.route('/device/:id/config-history').get(getDeviceConfig);

// Export router to use it in the main router.
module.exports = router;
