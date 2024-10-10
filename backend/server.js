const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes'); // Add this line
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const learningPathRoutes = require('./routes/learningPathRoutes');
const userRoutes = require('./routes/userRoutes');
const assignRoutes = require('./routes/assignRoutes');
const userCreateRoutes = require('./routes/userCreateRoutes');
const report = require('./routes/reportRoutes');
const finalReport = require('./routes/finalReportRoutes')
const enrolledRoutes = require('./routes/employee/enrolledRoutes')


const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes); // Add this line
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/learning-paths', learningPathRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/assign', assignRoutes);
app.use('/api',userCreateRoutes);
app.use('/api/reports', report);
app.use('/api/finalreports',finalReport)
app.use('/api/employee-enrollments',enrolledRoutes)
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// 'http://localhost:3000/api/reports/reports/completion-history