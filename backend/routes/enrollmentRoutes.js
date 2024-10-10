const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// Route for enrolling a user in a course
router.post('/enroll', enrollmentController.enrollUserInCourse);

// Route for getting all enrollments
router.get('/', enrollmentController.getEnrollments);

// Route for getting enrollments for a specific user
router.get('/user/:userId', enrollmentController.getUserEnrollments);

// Route for deleting an enrollment
router.delete('/:id', enrollmentController.deleteEnrollment);

// Route for getting courses by learning path ID
router.get('/courses/learning-path/:learningPathId', enrollmentController.getCoursesByLearningPathId);

// Route for getting all learning paths
router.get('/learning-paths', enrollmentController.getLearningPaths);

module.exports = router;
