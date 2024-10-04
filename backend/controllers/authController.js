const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prismaClient');

// Register a new user (Employee)
exports.registerEmployee = async (req, res) => {
  const { name, email, password, organizationDomain, designation, department, joiningDate } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'Employee', // Automatically assign role as Employee
        organizationDomain, // Save the organization domain
        designation,
        department,
        joiningDate,
      },
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { domainName, email, password } = req.body;

  try {
    // Find user by email and organization domain
    const user = await prisma.user.findFirst({ where: { email, organizationDomain: domainName } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, domain: user.organizationDomain },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Check Organization Domain availability
exports.checkOrganizationDomain = async (req, res) => {
  const { organizationDomain } = req.body;

  try {
    const existingDomain = await prisma.user.findUnique({
      where: { organizationDomain },
    });

    if (existingDomain) {
      return res.status(400).json({ message: 'Organization domain already taken' });
    }

    res.status(200).json({ message: 'Organization domain is available' });
  } catch (err) {
    res.status(500).json({ message: 'Error checking organization domain', error: err.message });
  }
};

// Register a new SuperAdmin
exports.registerSuperAdmin = async (req, res) => {
  const { name, email, password, organizationDomain, designation, department, joiningDate } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database with role as SuperAdmin
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SuperAdmin', // Automatically assign role as SuperAdmin
        organizationDomain,
        designation,
        department,
        joiningDate,
      },
    });

    res.status(201).json({ message: 'SuperAdmin registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error registering SuperAdmin', error: err.message });
  }
};
