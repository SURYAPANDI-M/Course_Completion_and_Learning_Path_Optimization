const prisma = require('../models/prismaClient');

// Middleware to check user's role
const checkUserRole = (req, res, next) => {
  const { role } = req.user; // Assuming user role is set in req.user after authentication

  if (role === 'SuperAdmin' || role === 'DepartmentAdmin') {
    return next();
  }
  
  return res.status(403).json({ message: 'Access denied' });
};

// Get all users (Only SuperAdmin can do this)
exports.getAllUsers = async (req, res) => {
  const { role } = req.user;

  if (role !== 'SuperAdmin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, designation, department } = req.body;
  const { role: requesterRole } = req.user;

  try {
    // Check if requester is SuperAdmin or DepartmentAdmin managing their department
    const userToUpdate = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!userToUpdate) return res.status(404).json({ message: 'User not found' });

    if (requesterRole === 'DepartmentAdmin' && userToUpdate.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied to update this user' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        role,
        designation,
        department,
      },
    });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  try {
    const userToDelete = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!userToDelete) return res.status(404).json({ message: 'User not found' });

    // Check if requester is SuperAdmin or DepartmentAdmin managing their department
    if (role === 'DepartmentAdmin' && userToDelete.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied to delete this user' });
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

// Get users by role (Only SuperAdmin can do this)
exports.getUsersByRole = async (req, res) => {
  const { role } = req.user;

  if (role !== 'SuperAdmin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { role: userRole } = req.params;

  try {
    const users = await prisma.user.findMany({ where: { role: userRole } });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users by role', error: err.message });
  }
};

// Add new user
exports.addUser = async (req, res) => {
  const { name, email, password, role, designation, department, joiningDate } = req.body;
  const { role: requesterRole } = req.user;

  try {
    // If requester is DepartmentAdmin, they can only add users to their department
    if (requesterRole === 'DepartmentAdmin' && department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied to add users to this department' });
    }

    // Create new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Ensure the password is hashed in the actual registration process
        role,
        designation,
        department,
        joiningDate,
      },
    });

    res.status(201).json({ message: 'User added successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error adding user', error: err.message });
  }
};
