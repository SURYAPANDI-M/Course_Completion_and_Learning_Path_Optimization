import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaBook, FaFolderPlus } from 'react-icons/fa';

const AssignCourse = () => {
    const [departments, setDepartments] = useState([]);
    const [departmentUsers, setDepartmentUsers] = useState({});
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [learningPaths, setLearningPaths] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [learningPathId, setLearningPathId] = useState('');

    useEffect(() => {
        fetchDepartments();
        fetchLearningPaths();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/assign/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Error fetching departments.');
        }
    };

    const fetchUsersByDepartment = async (departmentId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/assign/departments/${departmentId}/users`);
            setDepartmentUsers({ [departmentId]: response.data });
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users.');
        }
    };

    const fetchLearningPaths = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/assign/learning-paths');
            setLearningPaths(response.data);
        } catch (error) {
            console.error('Error fetching learning paths:', error);
            toast.error('Error fetching learning paths.');
        }
    };

    const fetchCoursesByLearningPath = async (learningPathId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/assign/learning-paths/${learningPathId}/courses`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Error fetching courses.');
        }
    };

    const handleDepartmentChange = (e) => {
        const selectedId = e.target.value;
        setSelectedDepartment(selectedId);
        fetchUsersByDepartment(selectedId);
    };

    const handleLearningPathChange = (e) => {
        const selectedId = e.target.value;
        setLearningPathId(selectedId);
        fetchCoursesByLearningPath(selectedId);
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/assign/enroll', {
                userId: selectedUserId,
                courseId: selectedCourseId,
                learningPathId: learningPathId || null,
            });
            toast.success('User enrolled successfully!');
            setSelectedUserId('');
            setSelectedCourseId('');
            setLearningPathId('');
        } catch (error) {
            console.error('Error enrolling user:', error);
            if (error.response && error.response.data.error) {
                if (error.response.data.error === 'User is already enrolled in this course.') {
                    toast.error('User is already enrolled in this course.');
                } else {
                    toast.error('Error enrolling user. Please try again.');
                }
            } else {
                toast.error('Error enrolling user. Please try again.');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaFolderPlus className="mr-2" />
                Assign Course to User
            </h2>
            <form onSubmit={handleEnroll} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="departments">Select Department:</label>
                    <select
                        id="departments"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a department</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="userId">Select User:</label>
                    <select
                        id="userId"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a user</option>
                        {filteredUsers.map(user => (
                            <option key={user.employeeId} value={user.employeeId}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="learningPathId">Select Learning Path:</label>
                    <select
                        id="learningPathId"
                        value={learningPathId}
                        onChange={handleLearningPathChange}
                        required
                        className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a learning path</option>
                        {learningPaths.map(lp => (
                            <option key={lp.id} value={lp.id}>
                                {lp.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="courseId">Select Course:</label>
                    <select
                        id="courseId"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                >
                    <FaBook className="mr-2" /> Enroll User
                </button>
            </form>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
    );
};

export default AssignCourse;
