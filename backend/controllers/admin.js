const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // Ensure you import bcrypt
const prisma = new PrismaClient();

// Home Stats
const homeStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    const totalLearningPaths = await prisma.learningPath.count();

    const completedEnrollments = await prisma.enrollment.count({
      where: { completionStatus: 'Completed' }
    });
    const totalEnrollments = await prisma.enrollment.count();
    const completionRate = totalEnrollments ? (completedEnrollments / totalEnrollments) * 100 : 0;

    const totalAdmins = await prisma.user.count({ where: { roleId: 1 } });
    const totalPathAdmins = await prisma.user.count({ where: { roleId: 2 } });
    const totalEmployees = await prisma.user.count({ where: { roleId: 3 } });

    res.json({
      totalUsers,
      totalCourses,
      totalLearningPaths,
      completedEnrollments,
      totalEnrollments,
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
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        designation: true,
        department: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, organizationDomain, roleId, designationId, departmentId } = req.body;

  if (!name || !email || !password || !organizationDomain || !roleId || !designationId || !departmentId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        organizationDomain,
        roleId,
        designationId,
        departmentId,
      },
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    console.log(error)
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, organizationDomain, roleId, designationId, departmentId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name || existingUser.name,
        email: email || existingUser.email,
        password: hashedPassword,
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

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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

// Course Management
const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createCourse = async (req, res) => {
  const { title, duration, difficultyLevel, description } = req.body;

  if (!title || !duration || !difficultyLevel || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        duration,
        difficultyLevel,
        description,
      },
    });
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Course Allegation
const courseAllegation = async (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ message: 'User ID and Course ID are required' });
  }

  try {
    // Check if the user is already allocated to the course
    const existingAllocation = await prisma.courseAllocation.findFirst({
      where: { userId, courseId }
    });

    if (existingAllocation) {
      // Send notification to admin that user is already allocated
      await prisma.notification.create({
        data: {
          message: `User ${userId} is already allocated to course ${courseId}`,
          userId: req.adminId, // Assuming adminId is available in the request
        }
      });
      return res.status(400).json({ message: 'User is already allocated to this course' });
    }

    // Allocate course
    const allocation = await prisma.courseAllocation.create({
      data: { userId, courseId },
    });

    res.status(201).json({ message: 'Course allocation successful', allocation });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Notification Management
const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      include: { user: true },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createNotification = async (req, res) => {
  const { message, userId } = req.body;

  try {
    const notification = await prisma.notification.create({
      data: {
        message,
        userId,
      },
    });
    res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Course Requests
const getRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      include: { user: true },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRequest = await prisma.request.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(updatedRequest);
  } catch (error){
  res.status(500).json({ message: 'Failed to handle request' });
}
};
// Learning Path Management
const getLearningPaths = async (req, res) => {
  try {
    const learningPaths = await prisma.learningPath.findMany({
      include: { courses: true }, // Include related courses
    });
    res.json(learningPaths);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCoursesByLearningPathId = async (req, res) => {
  const { id } = req.params;

  try {
    const courses = await prisma.learningPathCourse.findMany({
      where: { learningPathId: parseInt(id) },
      include: { course: true }, // Include course details
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Exporting all functions (updated)
module.exports = {
  homeStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getDepartments,
  getUsersByDepartmentId,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  courseAllegation,
  getNotifications,
  createNotification,
  getRequests,
  handleRequest,
  getLearningPaths,
  getCoursesByLearningPathId,
};


