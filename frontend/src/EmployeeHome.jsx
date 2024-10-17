import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeHome = () => {
  const [stats, setStats] = useState({
    completedCourses: 0,
    totalProgress: 0,
    totalCoursesEnrolled: 0,  // Added field for total enrolled courses
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
        const response = await axios.get(`http://localhost:3000/api/user/stats/${userId}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to fetch course statistics!');
      }
    };

    fetchStats();
  }, []);

  // Data for the bar chart
  const chartData = {
    labels: ['Total Enrolled', 'Completed Courses', 'Total Progress'],
    datasets: [
      {
        label: 'Course Statistics',
        data: [
          stats.totalCoursesEnrolled,
          stats.completedCourses,
          stats.totalProgress,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Color for total enrolled
          'rgba(153, 102, 255, 0.6)', // Color for completed courses
          'rgba(255, 159, 64, 0.6)',   // Color for total progress
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Course Statistics Overview',
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card for Total Courses Enrolled */}
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Courses Enrolled</h3>
          <p className="text-4xl font-bold">{stats.totalCoursesEnrolled}</p>
        </div>

        {/* Card for Completed Courses */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Completed Courses</h3>
          <p className="text-4xl font-bold">{stats.completedCourses}</p>
        </div>

        {/* Card for Total Progress */}
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Progress</h3>
          <p className="text-4xl font-bold">{stats.totalProgress}</p>
        </div>
      </div>

      {/* Bar Chart for Course Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <ToastContainer />
    </div>
  );
};

export default EmployeeHome;
