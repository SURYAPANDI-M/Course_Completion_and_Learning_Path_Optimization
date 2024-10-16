const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient(); // Create a new Prisma client instance

// Get all learning paths
const getLearningPaths = async (req, res) => {
  try {
    const learningPaths = await prisma.learningPath.findMany();
    res.json(learningPaths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ message: 'Error fetching learning paths' });
  }
};

// Get final reports based on learning path ID
const getFinalReports = async (req, res) => {
  const { learningPathId } = req.query ? req.query : undefined;
  
  try {
    const reportData = await prisma.enrollment.findMany({
      where: learningPathId ? { learningPathId: Number(learningPathId) } : {},
    });

    if (!reportData) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(reportData);
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ message: 'Error fetching report data nm' });
  }
};

module.exports = {
  getLearningPaths,
  getFinalReports,
};
