const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/query', controller.queryDeviceStatus);
router.get('/discovery', controller.discovery);
router.get('/unlock', congtroller.unlock);
router.get('/lock', controller.lock);

module.exports = router;
