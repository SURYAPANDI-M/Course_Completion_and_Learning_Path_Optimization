const express = require('express');
const router = express.Router();
const learningPathController = require('../controllers/learningPathController.js');

// Route for creating a new learning path
router.post('/', learningPathController.createLearningPath);

// Route for getting all learning paths
router.get('/', learningPathController.getLearningPaths);

// Route for getting a specific learning path by ID
router.get('/:id', learningPathController.getLearningPathById);

// Route for updating a learning path by ID
router.put('/:id', learningPathController.updateLearningPath);

// Route for deleting a learning path by ID
router.delete('/:id', learningPathController.deleteLearningPath);

module.exports = router;
