const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportsController');

// Define the routes for fetching data

// Route to get total user count
router.get('/users/count/:domain', reportController.getTotalUserCount);

// Route to get total employee count
router.get('/employees/count/:domain', reportController.getTotalEmployeeCount);

// Route to get total learning paths count
router.get('/learning-paths/count/:domain', reportController.getLearningPathCount);

// Route to get course completion rate
router.get('/completion-rate', reportController.getCourseCompletionRate);
router.get('/admin/count/:domain', reportController.getTotalAdminCount);
router.get('/reports/completion-history', reportController.getHistoricalCompletionRates);


module.exports = router;


// 'http://localhost:3000/api/reports/reports/completion-history