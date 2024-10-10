const express = require('express');
const router = express.Router();
const enrollmentController = require('../../controllers/employee/enrolledCourses');

// Route for getting user enrollments
router.get('/user/:userId', enrollmentController.getUserEnrollments);

// Route for updating course progress
router.put('/progress', enrollmentController.updateEnrollmentProgress);

module.exports = router;