const express = require('express');
const {
  homeStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  courseAllegation,
  getNotifications,
  createNotification,
  getRequests,
  handleRequest,
  getDepartments,
  getUsersByDepartmentId,
  getLearningPaths,
  getCoursesByLearningPathId,
} = require('../controllers/admin');

const router = express.Router();

// Home Stats
router.get('/home-stats', homeStats);

// User Management
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Course Management
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Course Allegation
router.post('/course-allocation', courseAllegation);

// Notification Management
router.get('/notifications', getNotifications);
router.post('/notifications', createNotification);

// Course Requests
router.get('/requests', getRequests);
router.put('/requests/:id', handleRequest);

// Department Management
router.get('/departments', getDepartments);
router.get('/departments/:id/users', getUsersByDepartmentId);

// Learning Path Management
router.get('/learning-paths', getLearningPaths);
router.get('/learning-paths/:id/courses', getCoursesByLearningPathId);

module.exports = router;
