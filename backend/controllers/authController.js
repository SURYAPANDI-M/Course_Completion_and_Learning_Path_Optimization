const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

// Check if the organization domain exists
exports.checkDomain = async (req, res) => {
  const { domain } = req.body; // Extract domain from request body
  try {
    // Check if the domain exists in the database
    const existingDomain = await prisma.user.findFirst({
      where: { organizationDomain: domain.toLowerCase() },
    });
    
    // If domain exists, return a message indicating it is not available
    if (existingDomain) {
      return res.status(200).json({ available: false, message: 'Domain already exists' });
    }

    // If domain does not exist, return a success message
    return res.status(200).json({ available: true, message: 'Domain is available' });
  } catch (error) {
    console.error(error); // Use console.error for errors
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register SuperAdmin for a new organization domain
exports.createOrganizationDomain = async (req, res) => {
  const { employeeId, domain, name, email, password, department, designation } = req.body;
 console.log(req.body);
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const roleData = await prisma.role.findUnique({ where: { name: 'Admin' } });
    const designationData = await prisma.designation.findUnique({ where: { title: designation } });
    const departmentData = await prisma.department.findUnique({ where: { name: department } });
    console.log("vijay")
    const superAdmin = await prisma.user.create({
      data: {
        employeeId: employeeId.toUpperCase(),
        name,
        email,
        password: hashedPassword,
        roleId: roleData.id,
        departmentId: departmentData.id,
        designationId: designationData.id,
        organizationDomain: domain.toLowerCase(),
      },
    });

    return res.status(201).json({ message: 'SuperAdmin created successfully', superAdmin });
  } catch (error) {
    console.error(error); // Use console.error for errors
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Employee sign-up
exports.signUpEmployee = async (req, res) => {
  const { employeeId, name, email, password, organizationDomain, designation, department } = req.body;

  try {
    // Check if the organization domain exists
    const orgExists = await prisma.user.findFirst({
      where: { organizationDomain: organizationDomain.toLowerCase() },
    });
    if (!orgExists) {
      return res.status(404).json({ message: 'Organization domain not found' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const designationData = await prisma.designation.findUnique({ where: { title: designation } });
    const departmentData = await prisma.department.findUnique({ where: { name: department } });
    const employeeRole = await prisma.role.findUnique({ where: { name: 'Employee' } });

    // Create a new employee
    const employee = await prisma.user.create({
      data: {
        employeeId: employeeId.toUpperCase(),
        name,
        email,
        password: hashedPassword,
        roleId: employeeRole.id,
        designationId: designationData.id,
        departmentId: departmentData.id,
        organizationDomain: organizationDomain.toLowerCase(),
      },
    });

    return res.status(201).json({ message: 'Employee registered successfully', employee });
  } catch (error) {
    console.error(error); // Use console.error for errors
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user based on role
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the organization
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const roleData = await prisma.role.findUnique({ where: { id: user.roleId } });

    // Generate JWT token
    const token = jwt.sign({ userId: user.employeeId, role: roleData.name },'helloworld', { expiresIn: '1h' });

    return res.status(200).json({ message: 'Logged in successfully', token, role:roleData.name,domain:user.organizationDomain, userId:user.employeeId });
  } catch (error) {
    console.error(error); // Use console.error for errors
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
