// controllers/userController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');


const getAllUsers = async (req, res) => {
    const {organizationDomain} = req.params;
    console.log(organizationDomain)
    try {
        const users = await prisma.user.findMany(
            {
                where:{
                    organizationDomain:organizationDomain
                }
            }
        );
        console.log(users)
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
};

const createUser = async (req, res) => {
    const { name, employeeId, password, email, organizationDomain, designationId, departmentId ,roleId} = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                employeeId,
                password: hashedPassword,
                email,
                organizationDomain, 
                roleId: Number(roleId),
                designationId, 
                departmentId 
            }
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getRole = async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Error fetching roles' });
    }
};


const getDesignations = async (req, res) => {
    try {
        const designations = await prisma.designation.findMany();
        return res.json(designations);
    } catch (error) {
        console.error('Error fetching designations:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, employeeId, password, email, organizationDomain, designationId, departmentId,roleId } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { employeeId: id } });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const updatedData = {
            name,
            employeeId,
            email,
            organizationDomain,
            designationId: parseInt(designationId),
            departmentId: parseInt(departmentId),
            roleId:Number(roleId)
        };

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { employeeId: id },
            data: updatedData
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    createUser,getDesignations,getAllUsers,getRole,updateUser 
};
