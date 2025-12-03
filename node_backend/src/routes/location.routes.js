// routes/location.routes.js
const express = require('express');
const router = express.Router();
const { getReverseGeocode } = require('../controllers/location.controller');

// GET /api/location/reverse?lat=13.07&lon=80.21
router.get('/reverse', getReverseGeocode);

module.exports = router;
