const express = require('express');
const { signUp, signIn } = require('../controllers/user');

const router = express.Router();

router.post('/signup', signUp);
router.get('/signing', signIn);

module.exports = router;
