const express = require('express');
const router = express.Router();
const {
    getDepartments,
    getUsersByDepartment,
    getLearningPaths,
    getCoursesByLearningPath,
    enrollUser,
} = require('../controllers/assignController');

// Define routes
router.get('/departments', getDepartments);
router.get('/departments/:departmentId/users/:domain', getUsersByDepartment);
router.get('/learning-paths', getLearningPaths);
router.get('/learning-paths/:learningPathId/courses', getCoursesByLearningPath);
router.post('/enroll', enrollUser);

module.exports = router;


// const response = await axios.get(`http://localhost:3000/api/assign/assigndepartments/${departmentId}/users`);