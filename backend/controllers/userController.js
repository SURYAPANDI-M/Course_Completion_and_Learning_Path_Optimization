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

// Get a user by email
exports.getUserByEmail = async (req, res) => {
    const { email } = req.params; // Get email from request parameters

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return res.status(500).json({ error: 'An error occurred while fetching user.' });
    }
};

// Update user information by email
exports.updateUser = async (req, res) => {
    const {email, name, roleId, departmentId, designationId } = req.body; // Update fields
    
    try {
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                name,
                roleId,
                departmentId,
                designationId,
            },
        });
        
        return res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: 'An error occurred while updating user.' });
    }
};

// Delete a user by email
exports.deleteUser = async (req, res) => {
    const { email } = req.body; // Get email from request parameters

    try {
        await prisma.user.delete({ where: { email } });
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: 'An error occurred while deleting user.' });
    }
};
