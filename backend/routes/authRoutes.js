const express = require('express');
const { 
  checkDomain, 
  createOrganizationDomain, 
  signUpEmployee, 
  login 
} = require('../controllers/authController');

const router = express.Router();

// Route to check if the organization domain is available
router.post('/check-domain', checkDomain);

// Route to create a new organization domain and register SuperAdmin
router.post('/create-organization-domain', createOrganizationDomain);

// Route to sign up a new employee
router.post('/signup', signUpEmployee);

// Route to login a user
router.post('/login', login);

module.exports = router;
