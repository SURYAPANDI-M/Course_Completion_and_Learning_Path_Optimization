const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient(); // Create a new Prisma client instance

// Create a new course and assign it to a learning path
exports.createCourse = async (req, res) => {
    try {
        const { title, duration, difficultyLevel, description, learningPathId } = req.body;

        // Convert learningPathId and duration to integers
        const learningPathIdInt = parseInt(learningPathId, 10);
        const durationInt = parseInt(duration, 10);

        // Check if the course already exists for the given learning path
        const existingCourse = await prisma.course.findFirst({
                  where : { title : title }
        });

        if (existingCourse) {
            return res.status(400).json({ error: 'This course is already assigned ' });
        }

        // Create a new course
        const newCourse = await prisma.course.create({
            data: {
                title,
                duration: durationInt, // Use the converted integer
                difficultyLevel,
                description,
            },
        });

        // Create the LearningPathCourse relationship
        await prisma.learningPathCourse.create({
            data: {
                learningPathId: learningPathIdInt,
                courseId: newCourse.id,
                sequence: 1, // Set a default sequence; adjust as needed
            },
        });

        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: 'Failed to add course.' });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma Client
    }
};



// Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany(); // Fetch all courses

        return res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
    const { id } = req.params; // Get ID from request parameters

    try {
        const course = await prisma.course.findUnique({
            where: { id: parseInt(id) }, // Ensure ID is an integer
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        return res.status(200).json(course);
    } catch (error) {
        console.error("Error fetching course:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a course by ID
exports.updateCourse = async (req, res) => {
    const { id } = req.params; // Get ID from request parameters
    const { title, duration, difficultyLevel, description, learningPathId } = req.body; // Extract fields from request body

    try {
        // Update the course details
        const updatedCourse = await prisma.course.update({
            where: { id: parseInt(id) }, // Ensure ID is an integer
            data: {
                title,
                duration,
                difficultyLevel,
                description,
            },
        });

        // Update the LearningPathCourse relation
        await prisma.learningPathCourse.updateMany({
            where: { courseId: parseInt(id) }, // Find the existing LearningPathCourse by course ID
            data: {
                learningPathId: parseInt(learningPathId), // Update to the new learningPathId
            },
        });

        return res.status(200).json({ message: 'Course updated successfully', updatedCourse });
    } catch (error) {
        console.error("Error updating course:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a course by ID and remove its relationships
exports.deleteCourse = async (req, res) => {
    const { id } = req.params; // Get ID from request parameters

    try {
        // Delete all related records in Enrollment
        await prisma.enrollment.deleteMany({
            where: { courseId: parseInt(id) }, // Ensure ID is an integer
        });

        // Delete all related records in CourseRequest
        await prisma.courseRequest.deleteMany({
            where: { courseId: parseInt(id) }, // Ensure ID is an integer
        });

        // Delete all related records in Feedback
        await prisma.feedback.deleteMany({
            where: { courseId: parseInt(id) }, // Ensure ID is an integer
        });

        // Delete all related records in PerformanceMetric
        await prisma.performanceMetric.deleteMany({
            where: { courseId: parseInt(id) }, // Ensure ID is an integer
        });

        // Delete all related records in LearningPathCourse
        await prisma.learningPathCourse.deleteMany({
            where: { courseId: parseInt(id) }, // Ensure ID is an integer
        });

        // Finally, delete the course itself
        await prisma.course.delete({
            where: { id: parseInt(id) }, // Ensure ID is an integer
        });

        return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error("Error deleting course:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
