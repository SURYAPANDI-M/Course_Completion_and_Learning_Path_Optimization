const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient(); // Create a new Prisma client instance

// Enroll a user in a course
exports.enrollUserInCourse = async (req, res) => {
    const { userId, courseId, learningPathId } = req.body; // Extract fields from request body

    try {
        // Check if the course is already assigned to the user
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
                userId,
                courseId,
            },
        });

        // If enrollment already exists, return a message
        if (existingEnrollment) {
            return res.status(400).json({ message: 'User is already enrolled in this course.' });
        }

        // Create the enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                userId,
                courseId,
                learningPathId, // Optional field for linking to a Learning Path
                completionStatus: 'Not Started', // Default status
                percentage: 0, // Default percentage
            },
        });

        return res.status(201).json({ message: 'User enrolled successfully', enrollment });
    } catch (error) {
        console.error("Error enrolling user:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all enrollments
exports.getEnrollments = async (req, res) => {
    try {
        const enrollments = await prisma.enrollment.findMany(); // Fetch all enrollments

        return res.status(200).json(enrollments);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get enrollments for a specific user
exports.getUserEnrollments = async (req, res) => {
    const { userId } = req.params; // Get user ID from request parameters

    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId }, // Find enrollments for the specific user
        });

        return res.status(200).json(enrollments);
    } catch (error) {
        console.error("Error fetching user enrollments:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an enrollment by ID
exports.deleteEnrollment = async (req, res) => {
    const { id } = req.params; // Get ID from request parameters

    try {
        // Delete the enrollment
        await prisma.enrollment.delete({
            where: { id: parseInt(id) }, // Ensure ID is an integer
        });

        return res.status(200).json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        console.error("Error deleting enrollment:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete all enrollments for a specific course when the course is deleted
exports.deleteEnrollmentsByCourseId = async (courseId) => {
    try {
        // Delete all enrollments related to the course
        await prisma.enrollment.deleteMany({
            where: { courseId: parseInt(courseId) }, // Ensure ID is an integer
        });
    } catch (error) {
        console.error("Error deleting enrollments for course:", error);
    }
};

// Get all courses for a specific learning path
exports.getCoursesByLearningPathId = async (req, res) => {
    const { learningPathId } = req.params; // Get learning path ID from request parameters

    try {
        // Fetch courses associated with the selected learning path
        const courses = await prisma.learningPathCourse.findMany({
            where: { learningPathId: parseInt(learningPathId) },
            include: {
                course: true, // Include course details
            },
        });

        return res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses for learning path:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all learning paths for dropdown
exports.getLearningPaths = async (req, res) => {
    try {
        // Fetch all learning paths
        const learningPaths = await prisma.learningPath.findMany();

        return res.status(200).json(learningPaths);
    } catch (error) {
        console.error("Error fetching learning paths:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
