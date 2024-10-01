const express = require('express');
const router = express.Router();
const {
  getHomeStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getDepartments,
  getUsersByDepartmentId,
  getLearningPaths,
  getCoursesByLearningPathId,
  allocateCourse,
} = require('../controllers/admin');

// Home Stats
router.get('/home/stats', getHomeStats);

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

// Department Management
router.get('/departments', getDepartments);
router.get('/users/department/:id', getUsersByDepartmentId);

// Learning Path Management
router.get('/learning-paths', getLearningPaths);
router.get('/courses/learning-path/:id', getCoursesByLearningPathId);

// Course Allocation
router.post('/courses/allocation', allocateCourse);

module.exports = router;
