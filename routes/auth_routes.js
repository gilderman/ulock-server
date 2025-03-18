const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth_controller');

router.get('/login', auth_controller.login);
router.get('/callback', auth_controller.callback);

module.exports = router;


