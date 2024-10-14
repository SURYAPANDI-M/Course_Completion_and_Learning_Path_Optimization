const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient(); // Create a new Prisma client instance

// Get total user count
exports.getTotalUserCount = async (req, res) => {
  try {
    const count = await prisma.user.count(); // Adjust the query as necessary
    res.json({ totalUsers: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user count' });
  }
};

// Get total employee count
exports.getTotalEmployeeCount = async (req, res) => {
  try {
    const employeeCount = await prisma.user.count({
      where: { roleId: 2 }, // Assuming 'roleId' field identifies employee
    });
    res.json({ count: employeeCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee count' });
  }
};

// Get total admin count
exports.getTotalAdminCount = async (req, res) => {
  try {
    const adminCount = await prisma.user.count({
      where: { roleId: 1 }, // Assuming 'roleId' field identifies admin
    });
    res.json({ count: adminCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin count' });
  }
};

// Get total learning paths count
exports.getLearningPathCount = async (req, res) => {
  try {
    const learningPathCount = await prisma.learningPath.count();
    res.json({ count: learningPathCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch learning path count' });
  }
};

// Get course completion rate
exports.getCourseCompletionRate = async (req, res) => {
  try {
    const totalCourses = await prisma.course.count();
    const completedCourses = await prisma.enrollment.count({
      where: { completionStatus: 'Completed' }, // Assuming courses have a status field
    });
    const completionRate = (completedCourses / totalCourses) * 100;
    res.json({ completionRate: completionRate.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course completion rate' });
  }
};

// Get historical course completion rates
// Get historical course completion rates
exports.getHistoricalCompletionRates = async (req, res) => {
  try {
    const totalCourses = await prisma.course.count(); // Fetch total courses to calculate rates

    const completionData = await prisma.enrollment.groupBy({
      by: ['completionDate'], // Group by completionDate
      _count: {
        completionStatus: true, // Count all completion statuses
      },
      orderBy: {
        completionDate: 'asc', // Order by completionDate
      },
    });

    // Transform the data to include completion rate
    const historicalRates = completionData.map((entry) => ({
      date: entry.completionDate,
      completionRate: (entry._count.completionStatus / totalCourses) * 100, // Calculate completion rate
    }));

    res.json(historicalRates);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch historical completion rates' });
  }
};
