// controllers/userController.js

const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient(); // Create a new Prisma client instance

// Get all users organized by departments
// exports.getAllUsers = async (req, res) => {
//     try {
//         const { domain } = req.body; // Assuming domain is used for further logic
//         const departments = await prisma.department.findMany();
//         const departmentId = [];
//         const departmentName = [];
        
//         for (let dept of departments) {
//             departmentId.push(dept.id);
//             departmentName.push(dept.name);
//         }
        
//         const departmentUsers = {};
//         for (let i in departmentId) {
//             departmentUsers[departmentName[i]] = await prisma.user.findMany({
//                 where: {
//                     departmentId: departmentId[i]
//                 },
//             });
//         }
        
//         console.log(departmentUsers);
//         return res.status(200).json(departmentUsers);
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         return res.status(500).json({ error: 'An error occurred while fetching users.' });
//     }
// };


exports.getUserStats = async (req, res) => {
  const { userId } = req.params;
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
    });

    const totalCoursesEnrolled = enrollments.length;
    const completedCourses = enrollments.filter(e => e.completionStatus === 'Completed').length;
    
    // Calculate total progress as the difference between total courses and completed courses
    const totalProgress = totalCoursesEnrolled - completedCourses;

    res.status(200).json({
      completedCourses,          // Number of completed courses
      totalProgress,             // Total progress count (incomplete courses)
      totalCoursesEnrolled,      // Total number of courses enrolled
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user statistics', error });
  }
};
