const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Route for creating a new course
router.post('/', courseController.createCourse);

// Route for getting all courses
router.get('/', courseController.getCourses);

// Route for getting a specific course by ID
router.get('/:id', courseController.getCourseById);

// Route for updating a course by ID
router.put('/:id', courseController.updateCourse);

// Route for deleting a course by ID
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
