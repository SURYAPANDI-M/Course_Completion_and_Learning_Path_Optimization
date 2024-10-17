const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get user profile data (without progress updates)
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  try {
    const user = await prisma.user.findUnique({
      where: { employeeId: userId },
      include: {
        enrollments: {
          include: {
            course: true, // Assuming enrollments have a relation to courses
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return only the relevant user details, excluding progress updates
    res.status(200).json({
      name: user.name,
      employeeId: user.employeeId,
      email: user.email,
      organizationDomain: user.organizationDomain,
      roleId: user.roleId,
      joiningDate: user.joiningDate,
      designationId: user.designationId,
      departmentId: user.departmentId,
      enrollments: user.enrollments, // This includes the enrollments without progress update logic
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};
