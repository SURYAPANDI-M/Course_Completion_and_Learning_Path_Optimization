const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient();

exports.getUserEnrollments = async (req, res) => {
    const { userId } = req.params;

    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId },
            orderBy:{
                id: 'asc'
            },
            include: {
                course: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        const enrollmentDetails = enrollments.map(enrollment => ({
            id: enrollment.id,
            percentage:enrollment.percentage,
            courseId: enrollment.courseId,
            courseTitle: enrollment.course.title,
            completionStatus: enrollment.completionStatus,
        }));

        return res.status(200).json(enrollmentDetails);
    } catch (error) {
        console.error("Error fetching user enrollments:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateEnrollmentProgress = async (req, res) => {
    const { enrollmentId, percentage } = req.body;
  
    try {
      // Retrieve the current enrollment record to check the current progress
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          id: enrollmentId,
        },
        select: {
          percentage: true, // Fetch only the current progress percentage
        },
      });
  
      // If enrollment is not found
      if (!existingEnrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }
  
      // Check if the new progress is greater than the existing progress
      if (parseInt(percentage) <= existingEnrollment.percentage) {
        return res.status(400).json({ error: 'New progress must be greater than the current progress' });
      }
  
      // Proceed with the update if the new percentage is greater
      const updatedEnrollment = await prisma.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          percentage: parseInt(percentage),  // Ensure the percentage is an integer
          completionStatus: parseInt(percentage) === 100 ? 'Completed' : 'In Progress',
          completionDate: parseInt(percentage) === 100 ? new Date() : null,
        },
      });
  
      res.json({ message: 'Progress updated successfully', updatedEnrollment });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Enrollment not found' });
      }
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  