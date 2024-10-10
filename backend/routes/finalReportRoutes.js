const express = require('express');
const router = express.Router();
const { getLearningPaths, getFinalReports } = require('../controllers/finalReportContoller');


// Route to get all learning paths
router.get('/learning-paths', getLearningPaths);

// Route to get final reports based on the learning path
router.get('/finalreports', getFinalReports);

module.exports = router;
