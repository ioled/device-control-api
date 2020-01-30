const express = require('express');
const router = express.Router();

// Import all controllers for registry info
const {getRegistries} = require('../controllers/registry');

// Router middleware to handle registry routes.
router.route('/registry').get(getRegistries);

// Export router to use it in the main router.
module.exports = router;
