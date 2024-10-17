// // routes/userRoute.js

const express = require('express');
const {  getUserStats} = require('../controllers/userController');

const router = express.Router();


router.get('/user/stats/:userId', getUserStats);

// // Route to get all users
// // router.get('/allusers', getAllUsers);

// // Route to get user by email
// router.post('/user', getUserByEmail); // Fetch user details by email

// // Route to update user
// router.put('/user/update', updateUser); // Update user information by email

// // Route to delete user
// router.delete('/user/delete', deleteUser); // Delete a user by email

module.exports = router;
