// routes/userRoutes.js

const express = require('express');
const { getAllUsers,createUser,getDesignations,getRole,updateUser } = require('../controllers/userCreateController');

const router = express.Router();

// Route to create a new user
router.post('/users', createUser);
router.get('/Designations', getDesignations);
router.get('/getalluser/:organizationDomain',getAllUsers)
router.get('/roles',getRole)
router.put('/users/:id',updateUser );
module.exports = router;


// const response = await axios.get('http://localhost:3000/api/departments');