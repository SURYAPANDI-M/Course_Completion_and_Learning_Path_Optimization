const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route to get user profile details
router.get('/user/profile/:userId', profileController.getUserProfile);

module.exports = router;
