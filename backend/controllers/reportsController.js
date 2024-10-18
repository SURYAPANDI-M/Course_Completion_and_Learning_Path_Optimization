const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient(); // Create a new Prisma client instance

// Get total user count
exports.getTotalUserCount = async (req, res) => {
  const {domain} = req.params;

  try {
    const count = await prisma.user.count(
      {
        where:{
          organizationDomain:domain
        }
      }
    ); // Adjust the query as necessary
    res.json({ totalUsers: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user count' });
  }
};

// Get total employee count
exports.getTotalEmployeeCount = async (req, res) => {
  const {domain} = req.params;
  try {
    const employeeCount = await prisma.user.count({
      where: { roleId: 2 ,
        organizationDomain:domain
      }, // Assuming 'roleId' field identifies employee
    });
    res.json({ count: employeeCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee count' });
  }
};

// Get total admin count
exports.getTotalAdminCount = async (req, res) => {
  const {domain} = req.params;
  console.log(domain)
  try {
    const adminCount = await prisma.user.count({
      where: {
       organizationDomain: domain,
       roleId: 1
       }, // Assuming 'roleId' field identifies admin
    });
   
    res.json({ count: adminCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin count' });
  }
};

// Get total learning paths count
exports.getLearningPathCount = async (req, res) => {
  const {domain} = req.params;
  try {
    const learningPathCount = await prisma.learningPath.count(
      {
        where:
        {
          organizationDomain:domain
        }
      }
    );
    res.json({ count: learningPathCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch learning path count' });
  }
};

// Get course completion rate
exports.getCourseCompletionRate = async (req, res) => {
  const domain = req.params.domain;
  try {
    const totalCourses = await prisma.enrollment.count();
    const completedCourses = await prisma.enrollment.count({
      where: { completionStatus: 'Completed' }, // Assuming courses have a status field
    });
    const completionRate = (completedCourses / totalCourses) * 100;
    console.log(totalCourses,completedCourses,completionRate);
    res.json({ completionRate: completionRate.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course completion rate' });
  }
};

// Get historical course completion rates
// Get historical course completion rates
// exports.getHistoricalCompletionRates = async (req, res) => {
//   try {
//     const totalCourses = await prisma.course.count(); // Fetch total courses to calculate rates

//     const completionData = await prisma.enrollment.groupBy({
//       by: ['completionDate'], // Group by completionDate
//       _count: {
//         completionStatus: true, // Count all completion statuses
//       },
//       orderBy: {
//         completionDate: 'asc', // Order by completionDate
//       },
//     });

//     // Transform the data to include completion rate
//     const historicalRates = completionData.map((entry) => ({
//       date: entry.completionDate,
//       completionRate: (entry._count.completionStatus / totalCourses) * 100, // Calculate completion rate
//     }));

//     res.json(historicalRates);
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).json({ error: 'Failed to fetch historical completion rates' });
//   }
// };
exports.getHistoricalCompletionRates = async (req, res) => {
  try {
    // Step 1: Fetch total enrollments per day (including ongoing and completed)
    const totalEnrollmentsPerDay = await prisma.enrollment.groupBy({
      by: ['enrollmentDate'], // Group by the enrollment date
      _count: {
        _all: true, // Count all enrollments
      },
      orderBy: {
        enrollmentDate: 'asc', // Order by enrollmentDate
      },
    });

    // Step 2: Fetch completed enrollments per day (those with a completionDate)
    const completedEnrollmentsPerDay = await prisma.enrollment.groupBy({
      by: ['completionDate'], // Group by the completion date
      _count: {
        _all: true, // Count completed enrollments
      },
      where: {
        completionDate: {
          not: null, // Only consider enrollments that have a completionDate (i.e., completed)
        },
      },
      orderBy: {
        completionDate: 'asc', // Order by completionDate
      },
    });

    // Step 3: Transform the data into a completion rate per day
    const historicalRates = totalEnrollmentsPerDay.map((entry) => {
      // Find the corresponding completed enrollments for the same day
      const completedEntry = completedEnrollmentsPerDay.find(
        (completed) =>
          completed.completionDate.toISOString().split('T')[0] ===
          entry.enrollmentDate.toISOString().split('T')[0]
      );

      const total = entry._count._all;
      const completed = completedEntry ? completedEntry._count._all : 0;

      return {
        date: entry.enrollmentDate,
        completionRate: (completed / total) * 100, // Calculate completion rate
      };
    });

    // Step 4: Send the transformed data as a JSON response
    res.json(historicalRates);
    console.log(historicalRates);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch historical completion rates' });
  }
};
