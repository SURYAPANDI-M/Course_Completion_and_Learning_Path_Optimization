const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDepartments = async (req, res) => {
    try {
        const departments = await prisma.department.findMany();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
};

const getUsersByDepartment = async (req, res) => {
    const { departmentId,domain } = req.params;
    console.log(domain)
    try {
        const users = await prisma.user.findMany({
            where: { 
                departmentId: Number(departmentId) ,
                organizationDomain: domain
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getLearningPaths = async (req, res) => {
    try {
        const learningPaths = await prisma.learningPath.findMany();
        res.json(learningPaths);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch learning paths' });
    }
};

const getCoursesByLearningPath = async (req, res) => {
    const { learningPathId } = req.params;
    console.log(req.params)
    try {
        const courses = await prisma.learningPathCourse.findMany({
            where: { learningPathId: Number(learningPathId) },
            include: { course: true }
        });
        res.json(courses.map(lpCourse => lpCourse.course));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};
const enrollUser = async (req, res) => {
    const { userId, courseId, learningPathId } = req.body;

    // Convert courseId and learningPathId to integers
    const courseIdInt = parseInt(courseId, 10);
    const learningPathIdInt = learningPathId ? parseInt(learningPathId, 10) : null;

    console.log('Received data for enrollment:', { userId, courseId: courseIdInt, learningPathId: learningPathIdInt });

    try {
        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { employeeId: userId },
        });
        if (!userExists) {
            return res.status(400).json({ error: 'User does not exist.' });
        }

        // Check if course exists
        const courseExists = await prisma.course.findUnique({
            where: { id: courseIdInt },
        });
        if (!courseExists) {
            return res.status(400).json({ error: 'Course does not exist.' });
        }

        // Check if the user is already enrolled in the course
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
                userId: userId,
                courseId: courseIdInt,
            },
        });
        if (existingEnrollment) {
            return res.status(400).json({ error: 'User is already enrolled in this course.' });
        }

        // Create new enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                userId,
                courseId: courseIdInt,
                learningPathId: learningPathIdInt,
                completionStatus: 'In Progress',
                percentage: 0,
            },
        });

        res.status(201).json(enrollment);
    } catch (error) {
        console.error('Error enrolling user:', error);
        res.status(500).json({ error: 'Failed to enroll user' });
    }
};

module.exports = {
    getDepartments,
    getUsersByDepartment,
    getLearningPaths,
    getCoursesByLearningPath,
    enrollUser,
};
