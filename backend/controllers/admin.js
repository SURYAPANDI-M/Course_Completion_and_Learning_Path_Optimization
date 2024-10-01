const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Home Stats
const getHomeStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    const totalLearningPaths = await prisma.learningPath.count();

    const completionRate = await prisma.enrollment.count({
      where: { completionStatus: 'Completed' }
    }) / (await prisma.enrollment.count()) * 100 || 0;

    const totalAdmins = await prisma.user.count({ where: { roleId: 1 } });
    const totalPathAdmins = await prisma.user.count({ where: { roleId: 2 } });
    const totalEmployees = await prisma.user.count({ where: { roleId: 3 } });

    res.json({
      totalUsers,
      totalCourses,
      totalLearningPaths,
      completionRate,
      totalAdmins,
      totalPathAdmins,
      totalEmployees
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User Management
const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

const createUser = async (req, res) => {
  const { id, name, email, password, organizationDomain, roleId, designationId, departmentId } = req.body;

  // Validate required fields
  if (!name || !email || !password || !organizationDomain || !roleId || !designationId || !departmentId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        id,
        name,
        email,
        password: hashedPassword,
        organizationDomain,
        roleId,
        designationId,
        departmentId
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, organizationDomain, roleId, designationId, departmentId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name || existingUser.name,
        email: email || existingUser.email,
        password: hashedPassword || existingUser.password,
        organizationDomain: organizationDomain || existingUser.organizationDomain,
        roleId: roleId || existingUser.roleId,
        designationId: designationId || existingUser.designationId,
        departmentId: departmentId || existingUser.departmentId,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.status(204).send();
};

// Course Management
const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve courses' });
  }
};

const createCourse = async (req, res) => {
  const { title, duration, difficultyLevel, description } = req.body;
  try {
    const newCourse = await prisma.course.create({
      data: { title, duration, difficultyLevel, description },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course' });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, duration, difficultyLevel, description } = req.body;
  try {
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { title, duration, difficultyLevel, description },
    });
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course' });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.course.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course' });
  }
};

// Department Management
const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUsersByDepartmentId = async (req, res) => {
  const { id } = req.params;

  try {
    const users = await prisma.user.findMany({
      where: { departmentId: parseInt(id) },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Learning Path Management
const getLearningPaths = async (req, res) => {
  try {
    const learningPaths = await prisma.learningPath.findMany();
    res.json(learningPaths);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCoursesByLearningPathId = async (req, res) => {
  const { id } = req.params;

  try {
    const learningPathCourses = await prisma.learningPathCourse.findMany({
      where: { learningPathId: parseInt(id) },
      include: { course: true },
    });

    const courses = learningPathCourses.map((lpc) => lpc.course);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Course Allocation
const allocateCourse = async (req, res) => {
  const { userId, courseIds } = req.body;

  try {
    const notifications = [];

    for (const courseId of courseIds) {
      const completion = await prisma.courseCompletion.findFirst({
        where: {
          enrollment: {
            userId,
            courseId,
          },
        },
      });

      if (completion) {
        notifications.push(`User has already completed course ID: ${courseId}`);
      } else {
        await prisma.enrollment.create({
          data: {
            userId,
            courseId,
            enrollmentDate: new Date(),
            completionStatus: 'In Progress',
          },
        });
      }
    }

    if (notifications.length > 0) {
      return res.status(200).json({ message: 'Courses allocated with notifications', notifications });
    } else {
      return res.status(201).json({ message: 'Courses allocated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getHomeStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getDepartments,
  getUsersByDepartmentId,
  getLearningPaths,
  getCoursesByLearningPathId,
  allocateCourse,
};
