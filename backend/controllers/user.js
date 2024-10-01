const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use an environment variable


// Sign-Up Function
const signUp = async (req, res) => {
    const { id,name, email, password, organizationDomain, roleName, designation, department } = req.body;
  
    // Validate required fields
    if (!name || !email || !password || !organizationDomain || !roleName || !designation || !department) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Check if the email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Find the role ID based on the role name
      const role = await prisma.role.findUnique({
        where: { name: roleName }
      });

    
      if (!role) {
        return res.status(400).json({ message: 'Invalid role name' });
      }
  
      // Find the designation ID based on the designation name
      const designationEntry = await prisma.designation.findUnique({
        where: { title: designation }
      });
  
      if (!designationEntry) {
        return res.status(400).json({ message: 'Invalid designation' });
      }
  
      // Find or create the department if necessary
      const departmentEntry = await prisma.department.findUnique({
        where: { name: department }
      });
  
      if (!departmentEntry) {
        return res.status(400).json({ message: 'Invalid department' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          id:id,
          name:name,
          email:email,
          password: hashedPassword,
          organizationDomain:organizationDomain,
          roleId: role.id, // Use the found role ID
          designationId: designationEntry.id, // Use the found designation ID
          departmentId:departmentEntry.id// Use the department name or ID
        },
      });
  
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// Sign-In Function
const signIn = async (req, res) => {
    const { email, password, organizationDomain } = req.body;
  
    // Validate required fields
    if (!email || !password || !organizationDomain) {
      return res.status(400).json({ message: 'Email, password, and organization domain are required' });
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
      }
  
      // Check if the organization domain matches
      if (user.organizationDomain !== organizationDomain) {
        return res.status(401).json({ message: 'Invalid Domain' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

module.exports = { signUp, signIn };
